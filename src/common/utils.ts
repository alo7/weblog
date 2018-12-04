// @ts-ignore
import flatten from 'flat'
import { ILevel } from '../type/IProperty'
import LocalStorageMethod from '../storage/LocalStorageMethod'
import ArrayStorageMethod from '../storage/ArrayStorageMethod'
import Xhr from '../ajax/xhr'
import Http from '../ajax/http'
import IConsole from '../type/IConsole'

// 用于设置console
let consoleFun: IConsole = console

/**
 * 生成uuid
 * @returns {string} 返回随机的uuid
 */
export const getUUID = (): string => {
  let d = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16)
  })
  return uuid
}

/**
 * 获取当前时间戳
 * @returns {number} 返回时间戳
 */
export const getTimestamp = (): number => {
  const date = new Date()
  return date.getTime()
}

/**
 * 判断当前运行环境是否为浏览器
 * @returns {boolean} 如果是浏览器则返回true
 */
export const isBrowser = (): boolean => {
  return typeof window === 'object'
}

/**
 * 判断数组里的值是否存在
 * @param arr {array} 要检测的数组
 * @param val {any} 要检测的值
 * @returns {boolean} 数组里存在值时返回true
 */
export const includes = (arr: any[], val: any): boolean => arr.some(i => i === val)

/**
 * 判断参数是否为空
 * @param params {array} 不限传参个数
 * @returns {boolean} 有一个为空，就返回true
 */
export const isEmpty = (...params): boolean => !params.every(i => {
  // JavaScript中Boolean方法会把: false, null, 0, "", undefined, NaN 强转为false，在这里用于判断是否有值
  // eslint-disable-next-line no-extra-boolean-cast
  return !Boolean(i) || i.toString().trim() !== ''
})

/**
 * 打平对象
 * 如果是多层嵌套对象，则打平成一层，以_连接
 * @param payload {object} payload对象
 * @returns {object} 返回最总打平的对象
 */
export const flattenPayload = (payload: object): object => {
  const payloadObj = payload
  for (let key in payloadObj) {
    // 防止for...in遍历到原型链造性能丢失
    if (({}).hasOwnProperty.call(payloadObj, key) && typeof payloadObj[key] === 'object') {
      // 如果payload的key存在__字符串，则替换成_。防止解析后的数据与原始数据不一样
      if (key.indexOf('__') !== -1) {
        const newKey = key.replace(/_+/, '_')
        payloadObj[newKey] = payloadObj[key]
        delete payloadObj[key]
      }
      // 发现一个是多层嵌套的对象，就打平整个对象
      return flatten(payloadObj, {
        delimiter: '__'
      })
    }
  }
  return payloadObj
}

export const setConsole = (fun: IConsole): void => {
  consoleFun = fun
}

/**
 * 在控制台输出
 * @param level {ILevel} 输出级别
 * @param msg {string} 输出内容
 * @returns {void} void
 */
export const message = (level: ILevel, msg: string): void => {
  consoleFun[level](`[WebLog]: ${msg}`)
}

/**
 * 数组对象转字符串
 * @param obj {Object} 要转化的数组对象
 * @returns {string} 转化后的字符串
 */
export const stringify = (obj: object): string => {
  if (obj === null || typeof obj === 'undefined') {
    return ''
  }
  try {
    return JSON.stringify(obj)
  } catch (e) {
    return ''
  }
}

/**
 * 字符串转数组对象
 * @param str {string} 要转的字符串
 * @returns {array} 转化后的数组
 */
export const parse = (str: string): object[] => {
  if (!str) {
    return []
  }
  try {
    return JSON.parse(str)
  } catch (e) {
    return []
  }
}

export const getDeviceType = () => {
  if (!isBrowser()) {
    return 'pc'
  }

  let ua = navigator.userAgent
  const isWindowsPhone = /(?:Windows Phone)/.test(ua)
  const isAndroid = /(?:Android)/.test(ua)
  const isFireFox = /(?:Firefox)/.test(ua)
  const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
  const isPhone = /(?:iPhone)/.test(ua) && !isTablet
  return isPhone
    ? 'iphone' : isAndroid
      ? 'android' : isWindowsPhone
        ? 'WindowsPhone' : isTablet
          ? 'pad' : 'unknown'
}

/**
 * 把ajax放在utils里，通过参数传入方式，引入到插件里。以便减少插件体积
 */
export const http = isBrowser() ? new Xhr() : new Http()

/**
 * 根据不同的运行环境，返回不同的存储方法
 */
export const storage = isBrowser() ? new LocalStorageMethod() : new ArrayStorageMethod()

export const flat = flatten
