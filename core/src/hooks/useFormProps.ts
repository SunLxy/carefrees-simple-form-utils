import { createElement, useEffect, useMemo } from "react"
import { FormProps } from "../interface"
import { useForm } from "../useStore"
import {
  FormProvider,
  useMultipleFormContext,
  CommonAttributesProvider
} from "."

export const useFormProps = (props: FormProps) => {
  const {
    columnNumber = 4,
    children,
    form,
    name,
    onFinish,
    onValuesChange,
    onFinishFailed,
    initialValues,
    initialHideValues,
    labelMode,
    className,
    style,
  } = props

  const [formInstance] = useForm(form)
  const multipleForm = useMultipleFormContext()
  /**设置表单初始值*/
  useMemo(() => {
    formInstance.init(initialValues, initialHideValues)
  }, [])

  /**设置回调方法*/
  formInstance.setCallbacks({ onFinish, onValuesChange, onFinishFailed })

  useEffect(() => {
    /**把当前的表单项进行收集*/
    const unMount = multipleForm.register(name, formInstance)
    return () => unMount();
  }, [name])

  /**提交*/
  const onChildSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    formInstance.submit()
  }

  return {
    ...props,
    onSubmit: onChildSubmit,
    columnNumber,
    children,
    labelMode,
    className,
    style,
    formInstance,
    multipleForm,
    content: (child: React.ReactNode = children) => {
      return createElement(FormProvider, {
        instance: formInstance,
        children: createElement(CommonAttributesProvider, {
          value: { labelMode, columnNumber },
          children: child
        })
      })
    }
  }
}
