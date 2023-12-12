
import { InstanceFunction, ValidateErrorEntity, LabelMode } from "./"


export interface InitialHideValuesType {
  [s: string]: boolean | InitialHideValuesType
}

export interface FormProps<Values = any> {
  /**
   * label 显示位置
   * @default "left"
  */
  labelMode?: LabelMode
  /**表单实例*/
  form?: InstanceFunction
  /**表单名称*/
  name?: string
  /**保存提交完成*/
  onFinish?: (values: Values) => void;
  /**保存提交失败*/
  onFinishFailed?: (value: ValidateErrorEntity) => void
  /**值变化触发事件*/
  onValuesChange?: (changedValues: any, values: Values) => void;
  /**
    * 表单项列数
    * @default 4
   */
  columnNumber?: number;
  /**初始值*/
  initialValues?: Values
  /**隐藏组件初始值**/
  initialHideValues?: InitialHideValuesType
  /**内容*/
  children?: React.ReactNode
  /**class name */
  className?: string
  /**样式*/
  style?: React.CSSProperties

}