import { ICompleteLog } from '../type/IProperty'
import { message, isEmpty } from '../common/utils'

/**
 * 检测日志格式是否符合规范
 * @param completeLog {ICompleteLog} 完整日志格式
 * @returns {boolean} 符合规范返回true
 */
const validateFormatLog = (completeLog: ICompleteLog): boolean => {
  // @ts-ignore
  const { env, device, app } = completeLog

  if (typeof env !== 'string') {
    message('error', 'env环境必须为字符串')
    return false
  }
  if (typeof device.name !== 'string') {
    message('error', 'deviceName必须为字符串')
    return false
  }
  if (isEmpty(app.name, app.type, app.version, app.channel, app.build)) {
    message('error', 'app信息不能为空')
    return false
  }
  return true
}

export default validateFormatLog
