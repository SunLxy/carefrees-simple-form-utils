import { createElement, ReactNode, useContext, useMemo } from "react"
import {
  create_CSTU_InstanceContext,
  create_CSTU_InstanceProvider,
  create_CSTU_hooks_InstanceContext,
  create_CSTU_hooks_InstanceItemRegister,
  create_CSTU_hooks_InstanceFieldWatch,
  CSTU_PathTypes,
  CSTU_toArray,
  CSTU_getFormatPath
} from "@carefrees/simple-store-utils"

import { FormInstance, useForm, MultipleFormInstance, useMultipleForm } from "../useStore"

import type { InstanceFunction, CommonAttributesProps } from "../interface"
export * from "./useFormProps"
export * from "./useIsHide"
export * from "./useItemError"
export * from "./useItemProps"
export * from "./useListProps"

//===========================================================================================================

export const FormContext = create_CSTU_InstanceContext<InstanceFunction>(new FormInstance().instance_function)

export const FormProvider = create_CSTU_InstanceProvider(useForm, FormContext)

export const useFormContext = create_CSTU_hooks_InstanceContext(FormContext)

export const useRegister = create_CSTU_hooks_InstanceItemRegister(FormContext, "register")

export const useRegisterWatch = create_CSTU_hooks_InstanceFieldWatch("registerWatch")

//===========================================================================================================

export const MultipleFormContext = create_CSTU_InstanceContext<MultipleFormInstance>(new MultipleFormInstance())

export const MultipleFormProvider = create_CSTU_InstanceProvider(useMultipleForm, MultipleFormContext)

export const useMultipleFormContext = create_CSTU_hooks_InstanceContext(MultipleFormContext)


//============================================公共参数===============================================================

export const CommonAttributesContext = create_CSTU_InstanceContext<CommonAttributesProps>({
  labelMode: "left",
  columnNumber: 4
})

export const CommonAttributesProvider = (props: { children: ReactNode, value: CommonAttributesProps }) => {
  const { children, value } = props
  return createElement(CommonAttributesContext.Provider, { value, children })
}

export const useCommonAttributesContext = () => useContext(CommonAttributesContext)

//============================================form list===============================================================

export const FormListContext = create_CSTU_InstanceContext<{ name: CSTU_PathTypes }>({
  name: []
})

export const FormListProvider = (props: { children: ReactNode, value: { name: CSTU_PathTypes } }) => {
  const { children, value } = props
  return createElement(FormListContext.Provider, { value, children })
}
export const useFormListContext = () => useContext(FormListContext)

/**
 * 获取 List 组件包裹内容的 拼接字段
 * @param name 当前字段值
*/
export const useFormListName = (name?: CSTU_PathTypes): [CSTU_PathTypes, string] => {

  const { name: parentName, } = useFormListContext()

  const newName = useMemo(() => {
    return CSTU_toArray(parentName).concat(CSTU_toArray(name))
  }, [name, parentName])

  return [newName, CSTU_getFormatPath(newName)]
}

