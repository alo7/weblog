// @ts-ignore
import UAParser from 'ua-parser-js'
import IOs from '../type/IOs'
import IDevice from '../type/IDevice'
import IClient from '../type/IClient'
import { isBrowser, flattenPayload, getDeviceType } from './utils'


// 如果是nodejs，则调用os，方便后面取值。不用再重新调用了
const os: any = !isBrowser() ? require('os') : {}

/**
 * 获取user-agent信息
 * @returns {string} 返回user-agent信息
 */
export const getInfoUA = (): string => (isBrowser() ? navigator.userAgent : '')

/**
 * 获取系统信息
 * 区分浏览器还是Nodejs
 * @param network_type 网络类型
 * @returns {IOs} 返回系统信息
 */
// @ts-ignore
export const getInfoOs = ({ network_type }): IOs => {
  let osInfo: IOs = {
    name: '',
    version: '',
    network_type: '',
    language: '',
    payload: {}
  }
  if (isBrowser()) {
    const ua = new UAParser()
    const { name, version } = ua.getOS()
    return {
      ...osInfo,
      name: name || '',
      version: version || '',
      network_type: network_type,
      language: navigator.language || 'zh-cn',
    }
  } else {
    const os = require('os')
    const platform = os.platform()
    const name = platform === 'darwin' ? 'mac' : platform === 'win32' ? 'windows' : 'linux'
    const env = process.env
    const language = (env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || 'zh-cn')
    return {
      ...osInfo,
      name: name,
      version: os.release(),
      network_type: network_type,
      language,
      payload: {}
    }
  }
}

/**
 * 获取设备信息
 * 参数以对象的方式传入
 * @param name 设备名称
 * @param resolution 分辨率
 * @param uuid 设备唯一id
 * @returns {IDevice} 返回设备信息
 */
export const getInfoDevice = ({
  name,
  model,
  manufacturer,
  resolution,
  machineId,
}): IDevice => {
  let deviceInfo: IDevice = {
    manufacturer: '',
    model: '',
    type: '',
    resolution,
    name,
    memory: 0,
    cpu: 0,
    machineId,
    payload: {}
  }
  if (isBrowser()) {
    const ua = new UAParser()
    const { vendor } = ua.getDevice()
    return {
      ...deviceInfo,
      manufacturer: manufacturer || vendor || '',
      model: model || ua.getDevice().model || '',
      type: getDeviceType() || '',
      resolution: window.screen.width + 'x' + window.screen.height,
      cpu: navigator.hardwareConcurrency || 0,
    }
  } else {
    return {
      ...deviceInfo,
      manufacturer: manufacturer || '',
      model: model || os.type(),
      type: 'pc',
      name: os.hostname(),
      cpu: os.cpus().length,
      memory: os.totalmem() / 1048576
    }
  }
}

/**
 * 获取起容器信息(浏览器信息 或 nodejs信息)
 * @returns {IClient} 返回容器信息
 */
export const getInfoClient = (): IClient => {
  let clientInfo = {
    name: '',
    version: '',
    payload: {}
  }
  if (isBrowser()) {
    const ua = new UAParser()
    const { name, version } = ua.getBrowser()
    return {
      ...clientInfo,
      name: name || '',
      version: version || ''
    }
  } else {
    return {
      ...clientInfo,
      name: 'Node',
      version: process.version || '',
    }
  }
}
