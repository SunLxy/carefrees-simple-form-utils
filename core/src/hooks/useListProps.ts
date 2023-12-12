import { useRef, useMemo, createElement } from "react"
import { FormListProvider } from "."
import { FormListProps } from "../interface"
import { useRegister, useFormListName } from "."
import { List } from "../useStore"

/**处理list表单*/
export const useListProps = (props: FormListProps) => {
  const { name, children, symbolId = "carefrees-form-list-register" } = props
  const [newName] = useFormListName(name)
  /**唯一id*/
  const register_uid = useRef(Symbol(symbolId))
  /**实例*/
  const instance = useRegister({ path: newName, uid: register_uid.current })
  /**List 实例*/
  const listInstance = useRef(new List()).current

  useMemo(() => {
    listInstance.init(newName, instance)
  }, [newName])

  return createElement(FormListProvider, {
    value: { name: newName },
    children: children?.({ fields: listInstance.getFields(), onAdd: listInstance.onAdd, onDelete: listInstance.onDelete }, listInstance)
  })
}