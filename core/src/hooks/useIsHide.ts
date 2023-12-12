import { useEffect } from "react"
import { use_CSTU_Update, CSTU_PathTypes } from "@carefrees/simple-store-utils"
import { useFormContext, useFormListName } from "."

/**是否隐藏表单项*/
export const useIsHide = (name: CSTU_PathTypes) => {
  const [newName, nameString] = useFormListName(name)
  const instance = useFormContext()
  const isHide = instance.getHideValue(newName)
  const refUpdate = use_CSTU_Update()
  useEffect(() => {
    let unMount: () => void = () => void 0;
    if (newName) {
      unMount = instance.registerHide({ path: newName, update: refUpdate.current, preserve: false })
    }
    return () => unMount()
  }, [nameString])

  return isHide
}