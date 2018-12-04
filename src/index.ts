// @ts-ignore
import * as utils from './common/utils'
import IWebLog from './type/IWebLog'
import IOs from './type/IOs'
import IDevice from './type/IDevice'
import IClient from './type/IClient'
import IApp from './type/IApp'
import IUser from './type/IUser'
import ILog from './type/ILog'
import {
  IEnv,
  ISendMode,
  ICacheSpace,
  ISendStrategy,
  IEventConfig,
  ICompleteLog,
  ILogExtraInfo,
  ILevel
} from './type/IProperty'
import { getInfoUA, getInfoOs, getInfoDevice, getInfoClient } from './common/getInfo'
import IConfig from './type/IConfig'
import controller from './controller/index'
import validateFormatLog from './validate/validateFormatLog'
import validateFormatPlugins from './validate/validateFormatPlugins'
import validateFormatEvent from './validate/validateFormatEvent'
import validateForConsole from './validate/validateForConsole'
import { prefix } from './common/config'
import IConsole from './type/IConsole'

// @ts-ignore
const { flattenPayload, getUUID, getTimestamp, includes } = utils

export default class WebLog implements IWebLog {
  private _env: IEnv = 'beta'  // 项目当前环境
  private _log: ILog // 日志信息
  private _ua: string  // user-agent
  private _os: IOs // 系统信息
  private _device: IDevice  // 设备信息
  private _client: IClient  // 客户端(容器)信息
  private _app: IApp  // 应用信息
  private _user: IUser

  private _sendMode: ISendMode = 'immediately' // 发送模式
  private _cacheSpace: ICacheSpace = 10 // 缓存大小
  private _plugins: object = {}  // 插件
  private _sessionId: string // 唯一id

  constructor(config: IConfig) {
    this._env = config.env || 'beta'
    this._ua = getInfoUA()
    this._os = getInfoOs({
      network_type: config.networkType || ''
    })
    this._device = getInfoDevice({
      name: config.deviceName || '',
      model: config.deviceModel || '',
      manufacturer: config.manufacturer || '',
      resolution: config.resolution || '',
      machineId: config.machineId || getUUID(),
    })
    this._sessionId = getUUID()
    this._client = getInfoClient()
    this.setApp(config.app)
    this.setUser(config.user)
    this.setLog()
  }

  /**
   * 设置发送模式
   * 参数以对象的方式传入
   * @param sendMode {ISendMode} 设置发送模式
   * @param cacheSpace {ICacheSpace} 设置缓存大小
   * @returns void
   */
  public setSendStrategy({ sendMode, cacheSpace }: ISendStrategy): void {
    // 如果不为immediately(立刻发送)，则不允许设置。
    if (this._sendMode === 'immediately') {
      this._sendMode = sendMode
    }
    this._cacheSpace = cacheSpace || 10
  }

  /**
   * 设置调用哪些插件
   * @param plugins {object} 插件
   * @returns void
   */
  public setPlugins(plugins: object): void {
    if (validateFormatPlugins(plugins)) {
      this._plugins = plugins
      // 调用插件的setUtils方法，把日志库里的utils方法传过去
      for (let key in this._plugins) {
        if (({}).hasOwnProperty.call(this._plugins, key)) {
          this._plugins[key].setUtils(utils)
        }
      }
    }
  }

  /**
   * 设置日志的补充信息
   * 只支持设置deviceModel、manufacturer、resolution、networkType、env
   * @param info {object} 设置补充的信息对象。
   * @returns void
   */
  public setLogSupplementaryInfo(info: object): void {
    const keys = Object.keys(info)
    keys.forEach(key => {
      const val = info[key]
      if (includes(['resolution', 'manufacturer', 'deviceModel'], key)) {
        this._device[key] = val
      }

      if (includes(['networkType'], key)) {
        this._os['network_type'] = val
      }

      if (key === 'env') {
        this._env = val
      }
    })
    this.setLog()
  }

  /**
   * 设置系统的额外信息
   * @param payload {object} 要添加的额外信息
   * @returns void
   */
  public setOsPayload(payload: object): void {
    this._os.payload = {
      ...this._os.payload,
      ...flattenPayload(payload)
    }
  }

  /**
   * 设置设备的额外信息
   * @param payload {object} 要添加的额外信息
   * @returns void
   */
  public setDevicePayload(payload: object): void {
    this._device.payload = {
      ...this._device.payload,
      ...flattenPayload(payload)
    }
  }

  /**
   * 设置容器的额外信息
   * @param payload {object} 需要添加的额外信息
   * @returns void
   */
  public setClientPayload(payload: object): void {
    this._client.payload = {
      ...this._client.payload,
      ...flattenPayload(payload)
    }
  }

  /**
   * 设置应用的额外信息
   * @param payload { object } 需要添加的额外信息
   * @returns void
   */
  public setAppPayload(payload: object): void {
    this._app.payload = {
      ...this._app.payload,
      ...flattenPayload(payload)
    }
  }

  /**
   * 设置用户信息
   * 参数以对象的方式传入
   * @param id {string} 用户id
   * @param type {string} 用户类型
   * @param payload {object} 额外信息(可选)
   * @returns void
   */
  public setUser({ id, type, payload }: IUser = {
    id: '',
    type: '',
    payload: {}
  }): void {
    this._user = {
      id,
      type,
      payload
    }
  }

  /**
   * 设置用户的额外信息
   * @param payload {object} 需要添加的额外信息
   * @returns void
   */
  public setUserPayload(payload: object): void {
    this._user.payload = {
      ...this._user.payload,
      ...flattenPayload(payload)
    }
  }

  public getLog(): ILog {
    return this._log
  }

  /**
   * 设置console函数，用于接替weblog自身的console
   * @param fun {IConsole} 将要设置的方法
   * @return void
   */
  public setConsole(fun: IConsole): void {
    if (!validateForConsole(fun)) {
      return
    }

    utils.setConsole(fun)
  }

  /**
   * 无视发送规则，直接把缓存里的日志全部发送
   * 此api，用于当用户关闭网站/应用时触发
   * @param cb {function} 发送完成之后调用的回调函数
   * @return void
   */
  public sendAll(cb: Function = () => {}): void {
    const senders = Object.keys(this._plugins)
    let flag = true
    const doneSendList = []
    const timeout = setTimeout(() => {
      flag = false
      cb()
    }, 3000)

    senders.forEach(sender => {
      const storageKeyName = `${prefix}${sender}`
      const logList = utils.storage.getItem(storageKeyName)
      if (logList.length > 0) {
        this._plugins[sender].entry(logList, name => {
          utils.storage.remove(storageKeyName)
          doneSendList.push(name)
          if (senders.length === doneSendList.length) {
            // @ts-ignore
            clearTimeout(timeout)
            flag && cb()
          }
        })
      }
    })
  }

  /**
   * 日志库发送方法
   * @param name {string} 日志的名称
   * @param value {string} 日志的value
   * @param payload {Object} payload信息
   * @param level {ILevel} 日志等级
   * @param eventConfig {IEventConfig} event配置
   * // Todo 为返回值提供typescript类型
   * @returns object
   */
  public event(name: string, value: string, payload: object, level: ILevel, eventConfig: IEventConfig): object {
    if (!validateFormatEvent(name, value, payload, level, eventConfig)) {
      return {}
    }

    // 设置额外信息，生成完整的日志格式
    const completeLog = this.setLogExtraInfo({
      name,
      value,
      payload,
      level,
      timestamp: getTimestamp(),
      uuid: getUUID(),
      sessionId: this._sessionId
    })

    // 验证日志格式
    if (!validateFormatLog(completeLog)) {
      return {}
    }

    // 把日志信息交给控制器，进行统一控制发送
    return controller({
      sendMode: this._sendMode,
      cacheSpace: this._cacheSpace,
      completeLog,
      eventConfig,
      plugins: this._plugins
    })
  }

  /**
   * 设置基本日志格式
   * @returns void
   */
  private setLog(): void {
    const { _env, _ua, _os, _device, _client, _app, _user } = this
    this._log = {
      env: _env,
      userAgent: _ua,
      os: _os,
      device: _device,
      client: _client,
      app: _app,
      user: _user
    }
  }

  /**
   * 设置日志的额外信息
   * @param extraInfo {ILogExtraInfo} 额外信息
   * @returns {ICompleteLog} 返回日志库生成的完整日志
   */
  private setLogExtraInfo(extraInfo: ILogExtraInfo): ICompleteLog {
    // 保证每次的日志都是最新的，因为修改了payload后，只是修改了this上的数据，没有同步到log变量上去
    this.setLog()

    const { name, value, level, payload, timestamp, uuid, sessionId } = extraInfo
    return {
      ...this.getLog(),
      timestamp,
      uuid,
      sessionId,
      level: level || 'info',
      payload: payload || {},
      event: {
        name: name || '',
        value: value || ''
      }
    }
  }

  /**
   * 设置App信息
   * @param app {IApp} 设置app信息
   * @returns void
   */
  private setApp(app: IApp): void {
    if (typeof app !== 'object') {
      throw Error('App信息必须填写')
    }
    const { name, version, type, channel, build, payload } = app
    this._app = {
      name: name || '',
      version: version || '',
      type: type || '',
      channel: channel || '',
      build: build || '',
      payload: payload || {}
    }
  }

  private getClientPayload(): object {
    return this._client.payload
  }
}
