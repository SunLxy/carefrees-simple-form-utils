import { LabelMode } from "./formItem"

export interface CommonAttributesProps {
  /**
   * label 显示位置
   * @default "left"
  */
  labelMode?: LabelMode
  /**
   * 表单项列数
   * @default 4
  */
  columnNumber?: number;
}