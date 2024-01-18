
import { useRef } from "react"
import type { InstanceFunction, ValidateErrorEntity } from "../interface"
import type { CSTU_PathTypes } from "@carefrees/simple-store-utils"
import { CSTU_toArray, CSTU_cloneByNamePathList } from "@carefrees/simple-store-utils"

export class MultipleFormInstance {

  private instanceMap: Map<string, InstanceFunction> = new Map([])

  /**
   * 注册表单实例
   * @param name 表单名称
   * @param form 表单实例
  */
  register = (name: string, form: InstanceFunction) => {
    this.instanceMap.set(name, form)
    return () => {
      this.instanceMap.delete(name)
    }
  }

  /**
   * 获取表单实例
   * @param name 表单名称
  */
  getFormInstances = (name?: string) => {
    if (name) {
      return this.instanceMap.get(name)
    }
    return this.instanceMap
  }

  /**
   * 验证表单规则
   * @param namePath 表单名称(如果不传递表单名称,则验证所有表单)
   * 
   * @example
   * ```ts
   * // 第一种
   * const result = await validate()
   * 
   * // 第二种
   * const result = await validate(['表单一','表单二'])
   * 
   * // 第三种
   * const result = await validate({ 表单一:["字段一","字段二"] ,表单二:["字段一","字段二"] })
   * 
   * 
   * ```
   * 
  */
  validate = async (namePath?: string | string[] | Record<string, string[]>) => {
    const listFormErrors: Record<string, ValidateErrorEntity> = {}
    let isSuccess = true
    let nameKeys = [];
    let isObject = false
    if (namePath) {
      if (Array.isArray(namePath)) {
        nameKeys = namePath;
      } else if (Object.prototype.toString.call(namePath) === '[object Object]') {
        isObject = true
        nameKeys = Object.keys(namePath)
      } else {
        nameKeys = [namePath]
      }
    } else {
      nameKeys = Array.from(this.instanceMap.keys());
    }
    const lg = nameKeys.length
    for (let index = 0; index < lg; index++) {
      const name = nameKeys[index];
      const form = this.instanceMap.get(name)
      try {
        const paths = isObject ? namePath[name] : undefined
        const result = await form.validate(paths)
        listFormErrors[name] = { errorFields: [], values: result }
      } catch (errs) {
        isSuccess = false
        listFormErrors[name] = errs
      }
    }
    /**成功抛出数据*/
    if (isSuccess) {
      return Promise.resolve(listFormErrors)
    }
    /**失败抛出数据*/
    return Promise.reject(listFormErrors)
  }

  /**
   * 获取表单中值
   * @param name 表单名称 (不存在时，获取所有表单值)
   * @param path 字段路径 (不存在的时候直接获取对应表单所有值)
   * 
  */
  getValues = (name?: string, path?: CSTU_PathTypes) => {
    if (!name) {
      const data = {}
      this.instanceMap.forEach((form, key) => {
        data[key] = form.getValue()
      })
      return data
    }
    const form = this.instanceMap.get(name)
    if (form) {
      return { [name]: form.getValue(path) }
    }
    const data = CSTU_cloneByNamePathList({}, CSTU_toArray(path))
    return { [name]: data }
  }

}


export function useMultipleForm(instance?: MultipleFormInstance) {
  const instanceRef = useRef<MultipleFormInstance>(null)
  if (!instanceRef.current) {
    if (instance) {
      instanceRef.current = instance
    } else {
      instanceRef.current = new MultipleFormInstance()
    }
  }
  return [instanceRef.current]
}
