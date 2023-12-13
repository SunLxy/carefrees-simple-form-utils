import { Children, isValidElement, cloneElement, useRef } from "react"
import { FormItemProps, } from "../interface"
import { use_CSTU_Update } from "@carefrees/simple-store-utils"
import { useRandomId } from "../utils/useRandomId"
import { useRegister, useCommonAttributesContext, useFormListName } from "."
import { Rule } from "../useStore/rule"

/**表单项处理参数*/
export const useItemProps = (props: FormItemProps) => {
  const { labelMode: parentLabelMode = "left", } = useCommonAttributesContext()
  const {
    name,
    required,
    label,
    children,
    trigger = "onChange",
    labelMode = parentLabelMode,
    style,
    className,
    rules,
    valuePropName = "value",
    getValueFromEvent,
    getAttrProps = () => ({}),
    noStyle,
    isDynamicsRules = false,
    symbolId = "carefrees-form-item-register"
  } = props
  /**处理字段值*/
  const [newName, nameString] = useFormListName(name)
  const register_uid = useRef(Symbol(symbolId))
  const uid = useRandomId(`${nameString}`)
  /**注册表单项*/
  const instance = useRegister({ path: newName, uid: register_uid.current })
  /**获取值*/
  const value = instance.getValue(newName)
  /**输入框配置*/
  const inputAttr = getAttrProps?.(value, instance)
  /**实例化规则数据*/
  const ruleConf = useRef(new Rule({ name: newName, rules, instance }))
  /**直接设置更新当前组件方法*/
  ruleConf.current.updateFormItem = use_CSTU_Update().current;
  /**自己动态控制时，除了组件卸载规则进行重置初始*/
  if (!isDynamicsRules) {
    ruleConf.current.rules = rules;
  }

  /**更新值触发事件*/
  const onValueChange = (event: any) => {
    let value: any = event;
    if (typeof getValueFromEvent === "function") {
      value = getValueFromEvent(event)
    } else if (event && event.target && typeof event.target === 'object' && valuePropName in event.target) {
      value = (event.target as HTMLInputElement)[valuePropName];
    }
    instance.updateValue(newName, value)
  }

  /**内容*/
  const content = isValidElement(children) && Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        ...inputAttr,
        [trigger]: onValueChange,
        id: uid,
        name: newName,
        [valuePropName]: value,
      } as any)
    }
    return child
  })

  return {
    uid,
    content,
    rules: ruleConf,
    required,
    label,
    labelMode,
    style,
    className,
    noStyle,
  }
}