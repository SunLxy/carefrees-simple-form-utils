
import type { ReactNode, CSSProperties } from "react"
import { LabelMode } from "./formItem"
export interface LayoutProps {
  /**
    * 表单项列数
    * @default 4
  */
  columnNumber?: number;
  children: React.ReactNode
}

export interface LayoutItemProps {
  /**内容*/
  children?: ReactNode
  /**错误信息*/
  error?: ReactNode
  /**样式*/
  style?: CSSProperties
  /**label 标签内容*/
  label?: ReactNode
  /**class name 值*/
  className?: string
  /**label 标签布局*/
  labelMode?: LabelMode
  /**必填样式*/
  required?: boolean
  /**label标签的 htmlFor 值 */
  htmlFor?: string
}
