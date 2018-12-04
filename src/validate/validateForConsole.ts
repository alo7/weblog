import { message } from '../common/utils'
import IConsole from '../type/IConsole'

export default (fun: IConsole): boolean => {
  if (fun == null) {
    message('error', '设置console时，不能设置为null或undefined')
    return false
  }

  if (typeof fun.debug !== 'function') {
    message('error', '设置console时，必须实现debug函数')
    return false
  }

  if (typeof fun.info !== 'function') {
    message('error', '设置console时，必须实现info函数')
    return false
  }

  if (typeof fun.warn !== 'function') {
    message('error', '设置console时，必须实现warn函数')
    return false
  }

  if (typeof fun.error !== 'function') {
    message('error', '设置console时，必须实现error函数')
    return false
  }

  return true
}
