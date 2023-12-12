import { useEffect, } from "react"
import { use_CSTU_Update } from "@carefrees/simple-store-utils"
import { useFormContext } from "."
import { Rule } from "../useStore/rule"

export interface FormItemErrorProps {
  rules: React.MutableRefObject<Rule>
}

/**错误信息*/
export const useItemErrors = (props: FormItemErrorProps) => {
  const { rules } = props
  const instance = useFormContext()
  const error = rules.current.messages
  /**直接设置更新当前组件方法*/
  rules.current.updateFormItemError = use_CSTU_Update().current;
  useEffect(() => {
    /**规则进行挂载*/
    const unMount = instance.registerValidator(rules.current)
    return () => unMount();
  }, [])

  return error
}