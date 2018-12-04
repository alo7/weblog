import { message } from '../common/utils'

export default (plugins: object): boolean => {
  for (let key in plugins) {
    if (({}).hasOwnProperty.call(plugins, key)) {
      const plugin = plugins[key]

      if (typeof plugin !== 'object' || typeof plugin.constructor !== 'function') {
        message('warn', `${key}插件注册失败: 必须是实例之后的对象`)
        return false
      }

      // 插件在实例化时，缺少了必要参数，为了防止继续运行从而导致crash，所以在这里加了一层过滤。
      // 如果返回true，说明实例化时出错了。如果为false或者undefined(没有提供时，会返回)。说明实例化时没有错误
      if (plugin.isInstanceError) {
        return false
      }

      if (typeof plugin.entry !== 'function') {
        message('warn', `${key}插件注册失败: 必须实现一个entry方法，用于设置日志、验证日志、转化日志、发送日志的入口`)
        return false
      }

      if (plugin.entry.length !== 2) {
        message('warn', `${key}插件注册失败: entry方法，必须有两个参数。用于接收日志库返回的日志，和发送完毕之后的回调函数`)
        return false
      }

      if (typeof plugin.setUtils !== 'function') {
        message('warn', `${key}插件注册失败: 必须实现一个setUtils方法，用于接受日志库的工具类`)
        return false
      }
    }
  }
  return true
}
