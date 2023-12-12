
import { useRef } from "react"
import { CSTU_Instance, CSTU_toArray, CSTU_getFormatPath, CSTU_cloneByNamePathList } from "@carefrees/simple-store-utils"
import type { CSTU_PathTypes } from "@carefrees/simple-store-utils"
import type { Rule } from "./rule"
import type {
  FormItemRegisterProps,
  FormRegisterWatchProps,
  InstanceFunction,
  Callbacks,
  FormItemRegisterHideProps,
  InitialHideValuesType,
  FromItemErrorListType
} from "../interface"
import { RuleItem } from "async-validator"

export class FormInstance<T = any> extends CSTU_Instance {

  // storeField: string, // 操作数据存储 字段
  // initialField:string, // 初始值存储 字段
  // componentField: string, // 挂载组件存储 字段
  // watchField: string // 挂载监听组件存储 字段
  // selectorMapField:string // 执行器方法集合存储 字段
  private storeField: string = "store"
  private initialField: string = "initialValues"
  private componentField: string = "componentList"
  private watchField: string = "watchList"

  private store: Partial<T> = {} // 操作数据存储 字段
  private initialValues: Partial<T> = {}// 初始值存储 字段
  private componentList: FormItemRegisterProps[] = [] // 挂载组件存储 字段
  private watchList: FormRegisterWatchProps[] = [] // 挂载监听组件存储 字段

  /**验证规则集合*/
  private validatorList: Rule[] = []

  // ======================================隐藏组件=====================================
  /**隐藏组件集合*/
  private hideList: FormItemRegisterHideProps[] = []
  /**隐藏组件字段对应的值*/
  private hideStore = {}
  /**隐藏组件字段对应的初始值*/
  private hideInitialValues = {}
  private hideStoreField: string = "hideStore"
  private hideInitialField: string = "hideInitialValues"
  private hideComponentField: string = "hideList"
  // ===========================================================================

  /** 回调函数 */
  private callbacks: Callbacks = {}

  /**
   * 设置初始值
   * @param initialValues 初始值
  */
  private init = (initialValues?: Partial<T>, initialHideValues?: InitialHideValuesType) => {
    this._create_CSTU_init<Partial<T>>(this.storeField, this.initialField, initialValues)
    this._create_CSTU_init<InitialHideValuesType>(this.hideStoreField, this.hideInitialField, initialHideValues)
  }

  /**
   * 注册 form item 
   * @param props 注册更新组件方法
   * */
  private register = (props: FormItemRegisterProps) => {
    return this._create_CSTU_register(this.componentField, this.storeField, this.initialField, props)
  }

  /**
   * 注册值更新监听
   * @param props 监听方法
  */
  private registerWatch = (props: FormRegisterWatchProps) => {
    return this._create_CSTU_registerWatch(this.watchField, props)
  }

  /**
   * 注册 form item 验证规则
   * @param validator 参数
   * */
  private registerValidator = (validator: Rule) => {
    this.validatorList.push(validator)
    return () => {
      this.validatorList = this.validatorList.filter(item => item !== validator)
    }
  }

  /**
   * 更新表单项规则
   * @param path 字段
   * @param rules 规则
   * @param message 提示信息
   * 
  */
  private updateValidatorRules = (path: CSTU_PathTypes, rules: RuleItem[], message?: string[]) => {
    const validator = this.validatorList.filter((ite) => CSTU_getFormatPath(ite.name) === CSTU_getFormatPath(path))
    if (validator && validator.length) {
      validator.forEach((item) => {
        item.updateRules(rules, message)
      })
    }
  }

  /**
  * 更新表单项提示信息
  * @param path 字段
  * @param message 提示信息
  * 
  */
  private updateValidatorMessage = (path: CSTU_PathTypes, message?: string[]) => {
    const validator = this.validatorList.filter((ite) => CSTU_getFormatPath(ite.name) === CSTU_getFormatPath(path))
    if (validator && validator.length) {
      validator.forEach((item) => {
        item.updateMessages(message)
      })
    }
  }

  /**
 * 注册 form hide item 隐藏组件
 * @param props 参数
 * */
  private registerHide = (props: FormItemRegisterHideProps) => {
    props.preserve = false
    return this._create_CSTU_register(this.hideComponentField, this.hideStoreField, this.hideInitialField, props)
  }

  /**
   * 更新隐藏组件数据方法
   * @param path 更新字段路径
   * @param value 更新值
  */
  private updateHideValue = (path: CSTU_PathTypes, value: any) => {
    this._create_CSTU_updateValue(this.hideComponentField, this.hideStoreField, undefined, path, value, true)
  }

  /**
   * 获取隐藏组件字段值
   * @param path 获取值路径
  */
  private getHideValue = (path?: CSTU_PathTypes) => {
    return this._create_CSTU_getValue(this.hideStoreField, path)
  }

  /**
   * 更新数据方法
   * @param path 更新字段路径
   * @param value 更新值
  */
  private updateValue = (path: CSTU_PathTypes, value: any) => {
    this._create_CSTU_updateValue(this.componentField, this.storeField, this.watchField, path, value, true)
    /**触发传递的 onValuesChange 事件*/
    const values = CSTU_cloneByNamePathList(this.getValue(), [path])
    this.callbacks.onValuesChange?.(values, this.getValue())
    /**校验数据*/
    this.validateOne(path)
  }

  /**
   * 批量更新数据方法
   * @param value 更新数据对象
   * @param notice 通知对应的组件更新
  */
  private bathUpdateValue = (value: Record<string | number, unknown>, notice: boolean | string[]) => {
    this._create_CSTU_bathUpdateValue(this.componentField, this.storeField, this.watchField, value, notice)
    /**触发传递的 onValuesChange 事件*/
    const values = CSTU_cloneByNamePathList(this.getValue(), Object.keys(value))
    this.callbacks.onValuesChange?.(values, this.getValue())
  }

  /**
   * 通知组件更新（当不传递值的时候，更新所有组件）
   * @param paths — 更新组件路径集合
  */
  private notice = (paths: string[] | boolean = true) => {
    this._create_CSTU_bathNotice(this.componentField, paths)
  }

  /**
   * 获取字段值
   * @param path 获取值路径
  */
  private getValue = (path?: CSTU_PathTypes) => {
    return this._create_CSTU_getValue(this.storeField, path)
  }

  private validateOne = async (path: CSTU_PathTypes) => {
    try {
      /**校验数据*/
      await this.validate([path])
    } catch (err) {

    }
  }

  /**
   * 验证表单规则
   * @param paths 字段路径(如果不传递字段路径,则验证所有)
  */
  private validate = async (paths?: CSTU_PathTypes[]): Promise<Object> => {
    return new Promise(async (resolve, reject) => {
      const errorFields: FromItemErrorListType[] = []
      const notErrorFields: FromItemErrorListType[] = []
      const nameListPath = []
      const lg = this.validatorList.length;
      for (let index = 0; index < lg; index++) {
        const validator = this.validatorList[index];
        const errorName = CSTU_toArray(validator.name)
        nameListPath.push(errorName)
        let isValidate = true
        if (Array.isArray(paths)) {
          /**判断是否存在当前需要验证的项*/
          const findx = paths.find((itk) => CSTU_getFormatPath(itk) === CSTU_getFormatPath(validator.name))
          if (!findx) {
            isValidate = false
          }
        }
        try {
          if (isValidate) {
            await validator.validator()
            notErrorFields.push({ errors: [], name: errorName })
          }
        } catch (errors) {
          if (errors)
            errorFields.push({ errors, name: errorName })
        }
      }
      const values = CSTU_cloneByNamePathList(this.getValue(), nameListPath)
      if (errorFields.length) {
        reject({ errorFields, values: values })
      } else {
        resolve(values)
      }
    })

  }

  /**
   * 提交
  */
  private submit = async () => {
    try {
      const result = await this.validate()
      if (result) {
        this.callbacks?.onFinish?.(result)
      }
    } catch (error) {
      this.callbacks.onFinishFailed?.(error)
    }
  }

  /**
   * 设置回调函数
  */
  private setCallbacks = (callbacks: Callbacks) => {
    this.callbacks = callbacks
  }

  /**返回状态数据*/
  private getStateData = () => {
    return {
      store: this.store,
      initialValues: this.initialValues,
      componentList: this.componentList,
      watchList: this.watchList,
      validatorList: this.validatorList,
      hideList: this.hideList,
      hideStore: this.hideStore,
      hideInitialValues: this.hideInitialValues,
    }
  }

  /**暴露实例方法*/
  get instance_function() {
    return {
      init: this.init,
      register: this.register,
      registerWatch: this.registerWatch,
      updateValue: this.updateValue,
      bathUpdateValue: this.bathUpdateValue,
      notice: this.notice,
      getValue: this.getValue,
      validate: this.validate,
      submit: this.submit,
      setCallbacks: this.setCallbacks,
      registerValidator: this.registerValidator,
      registerHide: this.registerHide,
      updateHideValue: this.updateHideValue,
      getHideValue: this.getHideValue,
      updateValidatorRules: this.updateValidatorRules,
      updateValidatorMessage: this.updateValidatorMessage,
      __stateData: this.getStateData()
    }
  }

}

export function useForm(instance?: InstanceFunction) {
  const instanceRef = useRef<InstanceFunction>(null)
  if (!instanceRef.current) {
    if (instance) {
      instanceRef.current = instance
    } else {
      instanceRef.current = new FormInstance().instance_function
    }
  }
  return [instanceRef.current]
}
