import { includes, message, isEmpty } from '../common/utils'
import { IEventConfig, ILevel } from '../type/IProperty'

export default (name: string, value: string, payload: object, level: ILevel, eventConfig: IEventConfig) => {
  if (typeof name !== 'string') {
    message('error', '发送event事件时，第一个参数必须为字符串')
    return false
  }

  if (isEmpty(value) && typeof value === 'string') {
    message('error', '发送event事件时，第二个参数必须为字符串')
    return false
  }

  if (isEmpty(payload) && ({}).toString.call(payload) === '[object Object]') {
    message('error', '发送event事件时，第三个参数必须为对象或留空')
    return false
  }

  if (isEmpty(level) && !includes([ 'debug', 'info', 'warn', 'error' ], level)) {
    message('error', '发送event事件时，第四个参数必须为debug, info, warn, error中的一个或留空')
    return false
  }

  if (isEmpty(eventConfig)) {
    if (({}).toString.call(eventConfig) === '[object Object]') {
      // @ts-ignore
      const { senders, behavior, isImmediately } = eventConfig
      if (isEmpty(senders) && ({}).toString.call(senders) !== '[object Array]') {
        message('error', '发送event事件时，第五个参数中的sender必须是数组或留空')
        return false
      }
      if (isEmpty(behavior) && ({}).toString.call(behavior) !== '[object String]') {
        message('error', '发送event事件时，第五个参数中的behavior必须是字符串或留空')
        return false
      }
      if (isEmpty(isImmediately) && ({}).toString.call(isImmediately) !== '[object Boolean]') {
        message('error', '发送event事件时，第五个参数中的immediately必须是布尔值或留空')
        return false
      }
    } else {
      message('error', '发送event事件时，第五个参数必须为对象或留空')
      return false
    }
  }

  return true
}
