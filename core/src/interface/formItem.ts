import { ReactNode } from "react"
import type { CSTU_PathTypes } from "@carefrees/simple-store-utils"
import { RuleItem } from "async-validator"
import { InstanceFunction, } from "./store"
import type { List } from "../useStore"

export type LabelMode = 'hidden' | 'left' | 'top';

export interface FormItemProps {
  /**
  * 存储字段
  * @description 数组形式的会转换为使用 '_' 连接的字符串
 */
  name: CSTU_PathTypes
  /**规则*/
  rules?: RuleItem[]
  /**
   * label 标签内容
  */
  label?: React.ReactNode
  /**
   * label 显示位置
   * @default "left"
  */
  labelMode?: LabelMode
  /**
   * 内容
  */
  children?: React.ReactNode
  /**
   * 设置收集字段值变更的时机
   * @default "onChange" 
  */
  trigger?: string
  /**
   * 子节点的值的属性
   * 
   * @default "value"
  */
  valuePropName?: string
  /**
   * 必填样式设置
  */
  required?: boolean
  /**
   * 为 true 时不带样式,作为纯字段控件使用
  */
  noStyle?: boolean
  /**
   * 设置如何将 event 的值转换成字段值	
  */
  getValueFromEvent?: (event: any) => any
  /**
   * 为子元素添加额外的属性	
  */
  getAttrProps?: (value: any, instance: InstanceFunction) => any
  /**
   * 是否自己动态控制规则数据
   * @default "false"
   */
  isDynamicsRules?: boolean;

  /**样式*/
  style?: React.CSSProperties
  /**class name值*/
  className?: string

  symbolId?: string
}

export interface FormListChildrenProps {
  /**数据集合*/
  fields: { name: number, key: number }[],
  /**添加*/
  onAdd: (initialValue?: Object) => void
  /**删除*/
  onDelete: (index: number | number[]) => void
}

export interface FormListProps {
  /**字段*/
  name: CSTU_PathTypes
  /**内容*/
  children?: (props: FormListChildrenProps, list: List) => ReactNode
  /**样式*/
  style?: React.CSSProperties
  /**class name值*/
  className?: string
  symbolId?: string
}