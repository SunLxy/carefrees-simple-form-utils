
import type { CSTU_PathTypes } from "@carefrees/simple-store-utils"
import { InstanceFunction } from "./../interface"

export class List {
  instance?: InstanceFunction;

  /**记录key值*/
  keys: number[] = []
  /**累加数据，唯一性*/
  id: number = 0
  name?: CSTU_PathTypes;
  /**
   * 初始化
   * @param name 字段
   * @param instance 表单实例
  */
  init = (name: CSTU_PathTypes, instance: InstanceFunction) => {
    this.name = name
    this.instance = instance
  }

  /**获取值*/
  getLastValue = () => {
    const value = this.instance?.getValue?.(this.name)
    /**对值进行处理*/
    const lastValue = Array.isArray(value) ? value : []
    return lastValue
  }

  /**
   * 添加一条
   * @param initialValue 初始值
  */
  onAdd = (initialValue: Object = {}) => {
    /**获取值*/
    const value = this.getLastValue()
    const listData = [...value, initialValue || {}]
    this.keys = [...this.keys, this.id];
    this.id++;// 累加
    this.instance.updateValue(this.name, listData)
  }

  /**
   * 删除
   * @param index 删除数据下标
  */
  onDelete = (index: number | number[]) => {
    /**获取值*/
    const value = this.getLastValue()
    /** 数据进行转换 Set 数据 */
    const indexSet = new Set(Array.isArray(index) ? index : [index]);
    this.keys = this.keys.filter((_, keysIndex) => !indexSet.has(keysIndex));
    const listData = value.filter((_, keysIndex) => !indexSet.has(keysIndex))
    this.instance.updateValue(this.name, listData)
  }

  /**获取渲染 list 字段拼接*/
  getFields = () => {
    const values = this.getLastValue();
    return values.map((__, index) => {
      let key = this.keys[index];
      if (key === undefined) {
        this.keys[index] = this.id;
        key = this.keys[index];
        this.id++;// 累加
      }
      return { name: index, key };
    })
  }

}