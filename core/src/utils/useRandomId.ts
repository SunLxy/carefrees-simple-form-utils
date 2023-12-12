import { useId, useMemo } from "react"

export function randomString(uId: string, field: string = '', length: number = 32) {
  const newUid = uId.replace(/:/g, "_")
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  const lg = t.length
  let str = "";
  for (let i = 0; i < length; i++) str += t.charAt(Math.floor(Math.random() * lg));
  return [str, newUid, field].join("_")
}

export const useRandomId = (name: string, pre: string = 'carefrees') => {
  const uId = useId()
  return useMemo(() => {
    const newId = uId.replace(/:/g, "_")
    return [pre, newId, name].join('')
  }, [uId, name])
}