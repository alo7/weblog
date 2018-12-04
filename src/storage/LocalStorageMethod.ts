import { parse, stringify } from '../common/utils'

export default class LocalStorageMethod {

  /**
   * 获取localStorage里某一指定key的值
   * @param key {string} 获取哪个字段
   * @returns {array} 返回数组，数组里是对象
   */
  getItem(key: string): object[] {
    return parse(localStorage.getItem(key))
  }

  /**
   * 设置localStorage里某一指定key的值
   * @param key {string} 要设置的字段
   * @param val {object} 要设置的值
   * @returns {array} 返回追加后的字段值
   */
  setItem(key: string, val: object): object[] {
    localStorage.setItem(key, stringify([val]))
    return this.getItem(key)
  }

  /**
   * 往localStorage里某一指定key的值里追加内容
   * @param key {string} 将要追加的字段
   * @param val {object} 要追加的内容
   * @returns {array} 返回追加后的字段值
   */
  push(key: string, val: object): object[] {
    const rawData = this.getItem(key)
    // 如果不存在此key
    if (rawData.length === 0) {
      return this.setItem(key, val)
    }

    rawData.push(val)
    localStorage.setItem(key, stringify(rawData))
    return this.getItem(key)
  }

  /**
   * 移除指定字段
   * @param key 将要移除的字段
   * @returns {void}
   */
  remove(key: string): void {
    localStorage.removeItem(key)
  }

  /**
   * 情清空所有localStorage信息
   * @returns {void}
   */
  clear(): void {
    localStorage.clear()
  }
}
