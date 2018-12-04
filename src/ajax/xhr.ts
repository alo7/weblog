import { IXhrData, IMethod } from '../type/IAjax'
// @ts-ignore
import { Promise } from 'es6-promise'

export default class Xhr {

  /**
   * 发送get请求
   * @param url {string} 请求url地址
   * @param data {IXhrData} 请求数据
   * @param header {object} 请求头部信息
   * @returns {Promise} 返回一个Promise对象
   */
  public get(url: string, data: IXhrData, header: object) {
    return this.createAjax(url, 'GET', data, header)
  }

  /**
   * 发送post请求
   * @param url {string} 请求url地址
   * @param data {IXhrData} 请求数据
   * @param header {object} 请求头部信息
   * @returns {Promise} 返回一个Promise对象
   */
  public post(url: string, data: IXhrData, header: object) {
    return this.createAjax(url, 'POST', data, header)
  }

  /**
   * 创建ajax方法
   * @param url {string} 请求url地址
   * @param method {IMethod} 发送方式
   * @param data {IXhrData} 请求数据
   * @param header {objct} 请求头部信息
   * @returns {Promise} 返回一个Promise对象
   */
  private createAjax(url: string, method: IMethod, data: IXhrData, header: object) {
    const ajax = new XMLHttpRequest()

    // 设置超时flag
    let timeout = false
    // 超时后关闭请求
    let timer = setTimeout(() => {
      timeout = true
      ajax.abort()
    }, 3000)

    return new Promise((resolve, reject) => {
      ajax.addEventListener('abort', () => {
        reject(`当前日志超时3秒，未被发送。当前日志为:${data}`)
      }, false)

      ajax.onreadystatechange = () => {
        if (ajax.readyState === 4) {
          if (timeout) return
          clearTimeout(timer)
          // 判断状态码是否为2开头
          if (Math.floor(ajax.status / 100) === 2) {
            resolve(ajax.responseText)
          } else {
            reject(ajax.status)
          }
        }
      }
      ajax.open(method, url)
      this.setHeader(ajax, header)
      ajax.send(data)
    })
  }

  /**
   * 设置头部信息
   * 因为header是一个对象，需要转成xhr可以用的格式
   * @param ajax {XMLHttpRequest} ajax对象
   * @param header {object} 头部对象
   * @returns void
   */
  private setHeader(ajax: XMLHttpRequest, header: object = {}): void {
    const headerList = header
    const keys = Object.keys(headerList)
    let len = keys.length
    while (len--) {
      const key = keys[len]
      const val = header[key]
      ajax.setRequestHeader(key, val)
    }
  }
}
