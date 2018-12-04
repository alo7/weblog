import IController from '../type/IController'
import { message, storage } from '../common/utils'
import { ICompleteLog } from '../type/IProperty'
import { prefix } from '../common/config'

/**
 * 发送日志到各个插件里
 * @param logList {array} 日志库生成的日志
 * @param plugin {function} 插件方法
 * @returns object
 */
const sendLogtoPlugins = (logList: ICompleteLog[] | object[], plugin: any): object => {
  // 把日志库生成的日志返回到插件里
  // 插件里的流程为: 从entry进入，依次设置日志、验证、转化、发送
  return plugin.entry(logList)
}

/**
 * 发送日志的控制器，根据不同的条件，决定何时发送日志
 * 传参为对象
 * @param sendMode {ISendMode} 发送模式
 * @param cacheSpace {number} 缓存大小
 * @param completeLog {ICompleteLog} 日志库生成的完整日志
 * @param eventConfig {IEventConfig} event的配置
 * @param plugins {object} 日志库引入的插件
 * @returns object
 */
// @ts-ignore
const controller = ({ sendMode, cacheSpace, completeLog, eventConfig, plugins }: IController): object => {
  let behavior: string = ''
  let senders: string[] = []
  let isImmediately: boolean = false
  if (eventConfig) {
    behavior = eventConfig.behavior || 'event'
    senders = eventConfig.senders || Object.keys(plugins)
    isImmediately = eventConfig.isImmediately || false
  } else {
    behavior = 'event'
    senders = Object.keys(plugins)
    isImmediately = false
  }

  // 确保sender里的发送方，在plugins里存在
  // 之所以要判断是否为object，而不是function，因为当实例化(new)之后，类型就为object了
  let newSenders = senders.filter(send => typeof plugins[send] === 'object')

  // 如果没有sender不在plugins里时，则此条日志不会发送
  if (newSenders.length === 0) {
    message('warn', `由于没有匹配的插件，此条日志不会发送到任何平台。当条日志为 => ${JSON.stringify(completeLog)}`)
    return {}
  }

  // 创建插件的存储变量。用于判断是否已经赋值了setInterval。防止多次运行setInterval
  const storagePlugins = (() => {
    const temp = {}
    for (let i = 0; i < newSenders.length; i++) {
      let sender = newSenders[i]
      let storage = `${prefix}${sender}`
      temp[storage] = false
    }
    return temp
  })()

  // 日志列表是一个数组，而每个日志也是一个数组，每个日志的数组第一位是完整的日志格式，第二个是这条日志的行为
  const currentLog = [completeLog, { behavior: behavior }]

  // 发送规则
  const sendRules = {
    immediately: (sender: string) => {
      // 如果是立刻发送，说明是单条日志，而单条日志是一个对象，为了确保格式的统一，则转成数组的形式
      return sendLogtoPlugins([currentLog], plugins[sender])
    },

    amount: (sender: string) => { // 定量发送
      const storageKeyName = `${prefix}${sender}`

      // 先push日志，再获取
      storage.push(storageKeyName, currentLog)
      const logList = storage.getItem(storageKeyName)

      // 如果存储的日志大于设置的缓存大小，则触发sendLogtoPlugins方法
      if (logList.length >= cacheSpace) {
        sendLogtoPlugins(logList, plugins[sender])

        // 发送完毕之后，则清空当前存储的字段
        storage.remove(storageKeyName)
      }
    },

    delay: (sender: string) => {  // 定时发送
      const storageKeyName = `${prefix}${sender}`

      storage.push(storageKeyName, currentLog)

      // 如果已经赋值了setInterval，则不再运行。保持里面的循环发送不变就好
      if (!storagePlugins[storageKeyName]) {
        storagePlugins[storageKeyName] = setInterval(() => {
          if (storage.getItem(storageKeyName).length !== 0) {
            sendLogtoPlugins(storage.getItem(storageKeyName), plugins[sender])
            storage.remove(storageKeyName)
          }
        }, cacheSpace * 1000)
      }
    }
  }

  const resultObject = {}

  // 循环发送
  newSenders.forEach(sender => {
    const saveResult = () => {
      resultObject[sender] = sendRules.immediately(sender)
    }

    const checkSendMode = () => {
      sendMode === 'immediately' ? saveResult() : sendRules[sendMode](sender)
    }

    // 如果当前日志的isImmediately为true，则当前日志立刻发送
    if (isImmediately) {
      saveResult()
      return
    }

    // 如果当前日志的behavior在插件的立刻发送名单里，则立刻发送，不走定时或定量的逻辑
    const pluginsImmediatelyList = plugins[sender].immediatelyList
    if (typeof pluginsImmediatelyList === 'undefined') {
      checkSendMode()
    } else {
      for (let i = 0; i < pluginsImmediatelyList.length; i++) {
        if (pluginsImmediatelyList[i] === behavior) {
          saveResult()
          return
        }
      }
      checkSendMode()
    }
  })

  return resultObject
}

export default controller
