`react`多平台快速创建表单

## 安装

```bash
$ npm install @carefrees/simple-form-utils # yarn add @carefrees/simple-form-utils
```

## API

### hooks

**组件参数处理**

1. `useFormProps`:处理`Form`组件参数
2. `useIsHide`:处理隐藏表单项组件参数
3. `useItemErrors`:处理表单项错误信息提示组件参数
4. `useListProps`:处理表单`List`组件参数
5. `useItemProps`:处理表单项组件参数

**状态管理**

1. `FormContext`:表单实例方法`Context`
2. `FormProvider`:表单实例方法`Provider`
3. `useFormContext`:获取表单实例方法
4. `useRegisterFieldItem`(或者使用`useRegister`):注册表单项
5. `useRegisterFieldWatch`(或者使用`useRegisterWatch`):注册监听值变化
6. `MultipleFormContext`:多表单实例方法`Context`
7. `MultipleFormProvider`:多表单实例方法`Provider`
8. `useMultipleFormContext`:获取多表单实例方法
9. `CommonAttributesContext`:公共参数`Context`
10. `CommonAttributesProvider`:公共参数`Provider`
11. `useCommonAttributesContext`:获取公共参数
12. `FormListContext`:表单`List`实例方法`Context`
13. `FormListProvider`:表单`List`实例方法`Provider`
14. `useFormListContext`:获取表单`List`实例方法
15. `useFormListName`:处理表单`List`的`name字段值`
16. `useForm`:创建表单实例
17. `useMultipleForm`:创建多表单实例

### 实体类

1. `FormInstance`:表单实例
2. `Rule`:表单项规则实例
3. `MultipleFormInstance`:多表单实例
4. `List`:表单`List`实例
  
### 方法

1. `randomString`:随机字符串
2. `useRandomId`:获取唯一`uid`

## 简单案例

```tsx mdx:preview
import React ,{ Fragment } from "react"
import { 
  FormProps, useFormProps, 
  FormItemProps, useForm ,
  useItemProps, useItemErrors,
  FormItemErrorProps,
  useListProps, FormListProps
} from "@carefrees/simple-form-utils"

const Form = (props: FormProps) => {
  const { content, children, onSubmit,...rest } = useFormProps(props)
 console.log("Form====>",rest)

  return content(
    <form onSubmit={onSubmit} >
      {children}
    </form>
  )
}

const FormItemError = (props: FormItemErrorProps) => {
  const error = useItemErrors(props)
  console.log("错误信息====>",error)
  return (Array.isArray(error) && !!error.length && <div  style={{ color: "red", boxSizing: "border-box" }} >{error}</div> || <Fragment />)
}

const Item = (props:FormItemProps)=>{
 const { content , rules ,label , ...rest} = useItemProps(props)
 console.log("Item====>",rest)
  /**简单化*/
  return (<div>
    <div><span>{label}</span> {content} </div>
    <FormItemError rules={rules} />
  </div>)
}

export const FormList = (props: FormListProps) => {
  const { className, style } = props
  const children = useListProps(props)
  return (
    <div style={style} >
      {children}
    </div>
  )
}

const Demo = ()=>{
  const [form] = useForm()

  const onClick = ()=>{
    console.log("打印实例===>",form)
  } 

  const onFinish = (...value)=>{
    console.log("提交打印===>",value)
  }

  return (<Form onFinish={onFinish} form={form} initialValues={{ 点对点1:"1"  }}  >
    <Item rules={[{ required: true, message: "必填项" }]} labelMode="left" label="成都洒出1" required name="点对点1">
      <input  />
    </Item>
    <Item rules={[{ required: true, message: "必填项" }]} labelMode="left" label="成都洒出2" required name="点对点2">
      <input  />
    </Item>
     <FormList name="aaa">
        {({ fields, onAdd, onDelete }) => {
          return <div style={{ border: "1px solid red", padding: 5, boxSizing: "border-box" }} >
            {fields.map((item) => {
              return <div style={{ border: "1px solid green", marginBottom: 5, padding: 5, boxSizing: "border-box" }} key={item.key}>
                <button type="button" onClick={() => onDelete(item.name)} >删除</button>
                <Item label={`标题${item.key}`} name={[item.name, "a"]} ><input style={{ width: "100%", boxSizing: "border-box" }} /></Item>
              </div>
            })}
            <br />
            <button type="button" onClick={() => onAdd({})} >添加</button>
          </div>
        }}
      </FormList>
    <button type="submit" >提交</button>
  </Form>)
}

export default Demo;

```

## 类型

**interface文件夹内类型**

```ts
// interface/form.ts

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

```

```ts
// interface/formItem.ts
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

```

```ts
// interface/store.ts
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
```

```ts
// interface/commonAttributes.ts

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
```

**useStore文件夹内类型**

```ts
// useStore/list.ts
import type { CSTU_PathTypes } from "@carefrees/simple-store-utils";
import { InstanceFunction } from "./../interface";
export declare class List {
    instance?: InstanceFunction;
    /**记录key值*/
    keys: number[];
    /**累加数据，唯一性*/
    id: number;
    name?: CSTU_PathTypes;
    /**
     * 初始化
     * @param name 字段
     * @param instance 表单实例
    */
    init: (name: CSTU_PathTypes, instance: InstanceFunction) => void;
    /**获取值*/
    getLastValue: () => any[];
    /**
     * 添加一条
     * @param initialValue 初始值
    */
    onAdd: (initialValue?: Object) => void;
    /**
     * 删除
     * @param index 删除数据下标
    */
    onDelete: (index: number | number[]) => void;
    /**获取渲染 list 字段拼接*/
    getFields: () => {
        name: number;
        key: number;
    }[];
}


```

```ts
// useStore/multiple.ts
import type { InstanceFunction, ValidateErrorEntity } from "../interface";
import type { CSTU_PathTypes } from "@carefrees/simple-store-utils";
export declare class MultipleFormInstance {
    private instanceMap;
    /**
     * 注册表单实例
     * @param name 表单名称
     * @param form 表单实例
    */
    register: (name: string, form: InstanceFunction) => () => void;
    /**
     * 获取表单实例
     * @param name 表单名称
    */
    getFormInstances: (name?: string) => InstanceFunction | Map<string, InstanceFunction>;
    /**
     * 验证表单规则
     * @param name 表单名称(如果不传递表单名称,则验证所有表单)
    */
    validate: (name?: string) => Promise<Record<string, ValidateErrorEntity<any>>>;
    /**
     * 获取表单中值
     * @param name 表单名称 (不存在时，获取所有表单值)
     * @param path 字段路径 (不存在的时候直接获取对应表单所有值)
     *
    */
    getValues: (name?: string, path?: CSTU_PathTypes) => {};
}
export declare function useMultipleForm(instance?: MultipleFormInstance): MultipleFormInstance[];

```

```ts
// useStore/rule.ts
import type { RuleItem } from "async-validator";
import type { CSTU_PathTypes } from "@carefrees/simple-store-utils";
import { InstanceFunction } from "./../interface";
export declare class Rule {
    /**表单实例*/
    instance?: InstanceFunction;
    /**字段*/
    name?: CSTU_PathTypes;
    /**规则*/
    rules: RuleItem[];
    /**验证规则错误提示信息*/
    messages?: string[];
    /**更新规则的时候，更新表单项(需要进行赋值)*/
    updateFormItem?: Function;
    /**更新提示信息时，更新提示信息组件(需要进行赋值)*/
    updateFormItemError?: Function;
    constructor(props: {
        name: CSTU_PathTypes;
        rules: RuleItem[];
        instance: InstanceFunction;
    });
    /**更新提示信息*/
    updateMessages: (message?: string[]) => void;
    /**更新规则(更新规则时，默认把提示信息置空)*/
    updateRules: (rules: RuleItem[], message?: string[]) => void;
    /**验证规则*/
    validator: () => Promise<unknown>;
}

```

```ts
// useStore/store.ts
import { CSTU_Instance } from "@carefrees/simple-store-utils";
import type { CSTU_PathTypes } from "@carefrees/simple-store-utils";
import type { Rule } from "./rule";
import type { FormItemRegisterProps, FormRegisterWatchProps, InstanceFunction, Callbacks, FormItemRegisterHideProps, InitialHideValuesType } from "../interface";
import { RuleItem } from "async-validator";
export declare class FormInstance<T = any> extends CSTU_Instance {
    private storeField;
    private initialField;
    private componentField;
    private watchField;
    private store;
    private initialValues;
    private componentList;
    private watchList;
    /**验证规则集合*/
    private validatorList;
    /**隐藏组件集合*/
    private hideList;
    /**隐藏组件字段对应的值*/
    private hideStore;
    /**隐藏组件字段对应的初始值*/
    private hideInitialValues;
    private hideStoreField;
    private hideInitialField;
    private hideComponentField;
    /** 回调函数 */
    private callbacks;
    /**
     * 设置初始值
     * @param initialValues 初始值
    */
    private init;
    /**
     * 注册 form item
     * @param props 注册更新组件方法
     * */
    private register;
    /**
     * 注册值更新监听
     * @param props 监听方法
    */
    private registerWatch;
    /**
     * 注册 form item 验证规则
     * @param validator 参数
     * */
    private registerValidator;
    /**
     * 更新表单项规则
     * @param path 字段
     * @param rules 规则
     * @param message 提示信息
     *
    */
    private updateValidatorRules;
    /**
    * 更新表单项提示信息
    * @param path 字段
    * @param message 提示信息
    *
    */
    private updateValidatorMessage;
    /**
   * 注册 form hide item 隐藏组件
   * @param props 参数
   * */
    private registerHide;
    /**
     * 更新隐藏组件数据方法
     * @param path 更新字段路径
     * @param value 更新值
    */
    private updateHideValue;
    /**
     * 获取隐藏组件字段值
     * @param path 获取值路径
    */
    private getHideValue;
    /**
     * 更新数据方法
     * @param path 更新字段路径
     * @param value 更新值
    */
    private updateValue;
    /**
     * 批量更新数据方法
     * @param value 更新数据对象
     * @param notice 通知对应的组件更新
    */
    private bathUpdateValue;
    /**
     * 通知组件更新（当不传递值的时候，更新所有组件）
     * @param paths — 更新组件路径集合
    */
    private notice;
    /**
     * 获取字段值
     * @param path 获取值路径
    */
    private getValue;
    private validateOne;
    /**
     * 验证表单规则
     * @param paths 字段路径(如果不传递字段路径,则验证所有)
    */
    private validate;
    /**
     * 提交
    */
    private submit;
    /**
     * 设置回调函数
    */
    private setCallbacks;
    /**返回状态数据*/
    private getStateData;
    /**暴露实例方法*/
    get instance_function(): {
        init: (initialValues?: Partial<T>, initialHideValues?: InitialHideValuesType) => void;
        register: (props: FormItemRegisterProps) => () => void;
        registerWatch: (props: FormRegisterWatchProps) => () => void;
        updateValue: (path: CSTU_PathTypes, value: any) => void;
        bathUpdateValue: (value: Record<string | number, unknown>, notice: boolean | string[]) => void;
        notice: (paths?: boolean | string[]) => void;
        getValue: (path?: CSTU_PathTypes) => any;
        validate: (paths?: CSTU_PathTypes[]) => Promise<Object>;
        submit: () => Promise<void>;
        setCallbacks: (callbacks: Callbacks<any>) => void;
        registerValidator: (validator: Rule) => () => void;
        registerHide: (props: FormItemRegisterHideProps) => () => void;
        updateHideValue: (path: CSTU_PathTypes, value: any) => void;
        getHideValue: (path?: CSTU_PathTypes) => any;
        updateValidatorRules: (path: CSTU_PathTypes, rules: RuleItem[], message?: string[]) => void;
        updateValidatorMessage: (path: CSTU_PathTypes, message?: string[]) => void;
        __stateData: {
            store: Partial<T>;
            initialValues: Partial<T>;
            componentList: FormItemRegisterProps[];
            watchList: FormRegisterWatchProps[];
            validatorList: Rule[];
            hideList: FormItemRegisterHideProps[];
            hideStore: {};
            hideInitialValues: {};
        };
    };
}
export declare function useForm(instance?: InstanceFunction): InstanceFunction[];


```

**hooks或者方法类型**

```ts
import { ReactNode } from "react";
import { FormListProps,FormItemProps,FormProps ,InstanceFunction, CommonAttributesProps} from "../interface";
import { Rule } from "../useStore/rule";
import { CSTU_PathTypes } from "@carefrees/simple-store-utils";
import { MultipleFormInstance } from "../useStore";

export declare const FormContext: import("react").Context<InstanceFunction>;
export declare const FormProvider: (props: import("@carefrees/simple-store-utils").CSTU_InstanceProviderProps<InstanceFunction, any>) => import("react").FunctionComponentElement<import("react").ProviderProps<InstanceFunction>>;
export declare const useFormContext: () => InstanceFunction;
export declare const useRegister: (props: import("@carefrees/simple-store-utils").Use_CSTU_InstanceItemRegisterProps) => InstanceFunction;
export declare const useRegisterWatch: (instance: import("@carefrees/simple-store-utils").CSTU_Instance, path: CSTU_PathTypes, fun?: (value: any) => void) => any;
export declare const MultipleFormContext: import("react").Context<MultipleFormInstance>;
export declare const MultipleFormProvider: (props: import("@carefrees/simple-store-utils").CSTU_InstanceProviderProps<MultipleFormInstance, any>) => import("react").FunctionComponentElement<import("react").ProviderProps<MultipleFormInstance>>;
export declare const useMultipleFormContext: () => MultipleFormInstance;
export declare const CommonAttributesContext: import("react").Context<CommonAttributesProps>;
export declare const CommonAttributesProvider: (props: {
    children: ReactNode;
    value: CommonAttributesProps;
}) => import("react").FunctionComponentElement<import("react").ProviderProps<CommonAttributesProps>>;
export declare const useCommonAttributesContext: () => CommonAttributesProps;
export declare const FormListContext: import("react").Context<{
    name: CSTU_PathTypes;
}>;
export declare const FormListProvider: (props: {
    children: ReactNode;
    value: {
        name: CSTU_PathTypes;
    };
}) => import("react").FunctionComponentElement<import("react").ProviderProps<{
    name: CSTU_PathTypes;
}>>;
export declare const useFormListContext: () => {
    name: CSTU_PathTypes;
};
/**
 * 获取 List 组件包裹内容的 拼接字段
 * @param name 当前字段值
*/
export declare const useFormListName: (name?: CSTU_PathTypes) => [CSTU_PathTypes, string];

export declare const useFormProps: (props: FormProps) => {
    onSubmit: import("react").FormEventHandler<HTMLFormElement>;
    columnNumber: number;
    children: import("react").ReactNode;
    labelMode: import("../interface").LabelMode;
    className: string;
    style: import("react").CSSProperties;
    formInstance: import("../interface").InstanceFunction;
    multipleForm: import("../useStore").MultipleFormInstance;
    content: (child?: React.ReactNode) => import("react").FunctionComponentElement<import("@carefrees/simple-store-utils").CSTU_InstanceProviderProps<import("../interface").InstanceFunction, any>>;
    form?: import("../interface").InstanceFunction;
    name?: string;
    onFinish?: (values: any) => void;
    onFinishFailed?: (value: import("../interface").ValidateErrorEntity<any>) => void;
    onValuesChange?: (changedValues: any, values: any) => void;
    initialValues?: any;
    initialHideValues?: import("../interface").InitialHideValuesType;
};

/**处理list表单*/
export declare const useListProps: (props: FormListProps) => import("react").FunctionComponentElement<{
    children: import("react").ReactNode;
    value: {
        name: import("@carefrees/simple-store-utils").CSTU_PathTypes;
    };
}>;

/**表单项处理参数*/
export declare const useItemProps: (props: FormItemProps) => {
    uid: string;
    content: import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>>[];
    rules: import("react").MutableRefObject<Rule>;
    required: boolean;
    label: import("react").ReactNode;
    labelMode: import("../interface").LabelMode;
    style: import("react").CSSProperties;
    className: string;
    noStyle: boolean;
};

export interface FormItemErrorProps {
    rules: React.MutableRefObject<Rule>;
}
/**错误信息*/
export declare const useItemErrors: (props: FormItemErrorProps) => string[];
/**是否隐藏表单项*/
export declare const useIsHide: (name: CSTU_PathTypes) => any;

export declare function randomString(uId: string, field?: string, length?: number): string;

export declare const useRandomId: (name: string, pre?: string) => string;

```
