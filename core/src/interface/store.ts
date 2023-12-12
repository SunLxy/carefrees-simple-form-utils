import type { CSTU_RegisterProps, CSTU_RegisterWatchProps, CSTU_PathTypes } from "@carefrees/simple-store-utils"
import { InitialHideValuesType } from "./form"
import type { Rule } from "../useStore/rule"
import { RuleItem } from "async-validator"

export interface FormItemRegisterProps extends CSTU_RegisterProps {

}

export interface FormRegisterWatchProps extends CSTU_RegisterWatchProps {

}

export interface FormItemRegisterHideProps extends CSTU_RegisterProps {

}

export interface FromItemErrorListType {
  /**错误信息*/
  errors: string[];
  /**字段*/
  name: CSTU_PathTypes;
}

export interface Callbacks<Values = any> {
  /**值更新触发*/
  onValuesChange?: (changedValues: any, values: Values) => void;
  /**提交保存 验证成功*/
  onFinish?: (values: Values) => void;
  /**提交保存 验证失败*/
  onFinishFailed?: (errorInfo: ValidateErrorEntity<Values>) => void;
}

export interface ValidateErrorEntity<Values = any> {
  values: Values;
  errorFields: { name: CSTU_PathTypes; errors: string[] }[];
}

export interface InstanceFunction {
  /**
   * 设置初始值
   * @param initialValues 初始值
  */
  init: (initialValue?: Partial<any>, initialHideValues?: InitialHideValuesType) => void;
  /**
  * 注册 form item 
  * @param props 注册更新组件方法
  * */
  register: (props: FormItemRegisterProps) => () => void;

  /**
   * 注册值更新监听
   * @param props 监听方法
  */
  registerWatch: (props: FormRegisterWatchProps) => () => void;
  /**
  * 注册 form item 验证规则
  * @param validator 参数
  * */
  registerValidator: (validator: Rule) => () => void
  /**
  * 注册 form hide item 隐藏组件
  * @param props 参数
  * */
  registerHide: (props: FormItemRegisterHideProps) => () => void
  /**
   * 更新数据方法
   * @param path 更新字段路径
   * @param value 更新值
  */
  updateValue: (path: CSTU_PathTypes, value: any) => void;
  /**
 * 批量更新数据方法
 * @param value 更新数据对象
 * @param notice 通知对应的组件更新
*/
  bathUpdateValue: (value: Record<string | number, unknown>, notice: boolean | string[]) => void;
  /**
   * 通知组件更新（当不传递值的时候，更新所有组件）
   * @param paths — 更新组件路径集合
  */
  notice: (paths?: string[] | boolean) => void;
  /**
   * 获取字段值
   * @param path 获取值路径
  */
  getValue: (path?: CSTU_PathTypes) => any;
  /**
   * 验证表单规则
   * @param paths 字段路径(如果不传递字段路径,则验证所有)
  */
  validate: () => Promise<ValidateErrorEntity | any>
  /**
   * 提交
  */
  submit: () => Promise<void>
  /**
   * 设置回调函数
  */
  setCallbacks: (callbacks: Callbacks<any>) => void
  /**
   * 更新隐藏组件数据方法
   * @param path 更新字段路径
   * @param value 更新值
  */
  updateHideValue: (path: CSTU_PathTypes, value: any) => void
  /**
   * 获取隐藏组件字段值
   * @param path 获取值路径
  */
  getHideValue: (path?: CSTU_PathTypes) => any

  /**
   * 更新表单项规则
   * @param path 字段
   * @param rules 规则
   * @param message 提示信息
   * 
  */
  updateValidatorRules: (path: CSTU_PathTypes, rules: RuleItem[], message?: string[]) => void
  /**
  * 更新表单项提示信息
  * @param path 字段
  * @param message 提示信息
  * 
  */
  updateValidatorMessage: (path: CSTU_PathTypes, message?: string[]) => void

  /**返回状态数据*/
  __stateData: {
    /**操作数据存储 */
    store: Partial<any>;
    /**初始值存储 */
    initialValues: Partial<any>;
    /**挂载组件存储 */
    componentList: FormItemRegisterProps[];
    /**挂载监听组件存储 */
    watchList: FormRegisterWatchProps[];
    /**验证规则集合 */
    validatorList: Rule[];
    /**隐藏组件集合 */
    hideList: FormItemRegisterHideProps[];
    /**隐藏组件字段对应的值段*/
    hideStore: Object;
    /**隐藏组件字段对应的初始值 */
    hideInitialValues: Object;
  }
}