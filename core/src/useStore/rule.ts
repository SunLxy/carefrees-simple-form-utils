import type { RuleItem } from "async-validator"
import type { CSTU_PathTypes } from "@carefrees/simple-store-utils"
import { InstanceFunction } from "./../interface"
import AsyncValidator from "async-validator"
import { CSTU_getFormatPath, } from "@carefrees/simple-store-utils"

export class Rule {
  /**表单实例*/
  instance?: InstanceFunction
  /**字段*/
  name?: CSTU_PathTypes = undefined
  /**规则*/
  rules: RuleItem[] = []
  /**验证规则错误提示信息*/
  messages?: string[] = []

  /**更新规则的时候，更新表单项(需要进行赋值)*/
  updateFormItem?: Function
  /**更新提示信息时，更新提示信息组件(需要进行赋值)*/
  updateFormItemError?: Function

  constructor(props: { name: CSTU_PathTypes, rules: RuleItem[], instance: InstanceFunction }) {
    const { name, rules, instance } = props
    this.name = name
    this.rules = rules
    this.instance = instance
  }

  /**更新提示信息*/
  updateMessages = (message?: string[]) => {
    this.messages = message || []
    this.updateFormItemError?.({})
  }

  /**更新规则(更新规则时，默认把提示信息置空)*/
  updateRules = (rules: RuleItem[], message?: string[]) => {
    this.rules = rules;
    this.messages = message || []
    this.updateFormItem?.({})
  }

  /**验证规则*/
  validator = () => {
    return new Promise((resolve, reject) => {
      const newValue = this.instance.getValue(this.name)
      const nameString = CSTU_getFormatPath(this.name)
      const validator = new AsyncValidator({ [nameString]: this.rules || [] });
      validator.validate({ [nameString]: newValue }).then((values) => {
        resolve(values)
        this.updateMessages()
      }).catch(({ errors }) => {
        if (Array.isArray(errors)) {
          const errorList = errors.map(it => it.message)
          this.updateMessages(errorList)
          reject(errorList)
        } else {
          reject()
        }
      })
    })
  }

}
