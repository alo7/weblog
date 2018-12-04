import { parse, stringify } from '../common/utils'

export default class ArrayStorageMethod {
  private logList: object;
  constructor() {
    this.logList = {}
  }

  /**
   * 获取logList里某一指定key的值
   * @param key {string} 获取哪个字段
   * @returns {array} 返回数组，数组里是对象
   */
  getItem(key: string): object[] {
    return parse(this.logList[key])
  }

  /**
   * 设置logList里某一指定key的值
   * @param key {string} 要设置的字段
   * @param val {object} 要设置的值
   * @returns {array} 返回追加后的字段值
   */
  setItem(key: string, val: object): object[] {
    this.logList[key] = stringify([ val ])
    return this.getItem(key)
  }

  /**
   * 往logList里某一指定key的值里追加内容
   * @param key {string} 将要追加的字段
   * @param val {object} 要追加的内容
   * @returns {array} 返回追加后的字段值
   */
  push(key: string, val: object): object[] {
    const rawData = this.getItem(key)
    if (rawData.length === 0) {
      return this.setItem(key, val)
    }

    rawData.push(val)
    this.logList[key] = stringify(rawData)
    return this.getItem(key)
  }

  /**
   * 移除指定字段
   * @param key 将要移除的字段
   * @returns {void}
   */
  remove(key: string): void {
    delete this.logList[key]
  }

  /**
   * 情清空所有logList信息
   * @returns {void}
   */
  clear(): void {
    this.logList = {}
  }
}
