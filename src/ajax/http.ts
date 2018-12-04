import { IMethod, IHttpData } from '../type/IAjax'
// @ts-ignore
import { Promise } from 'es6-promise'

export default class Http {

  /**
   * 发送get请求
   * @param url {string} 请求url地址
   * @param data {IHttpData} 请求数据
   * @param header {object} 请求头部信息
   * @returns {Promise} 返回一个Promise对象
   */
  public get(url, data, header) {
    return this.createAjax(url, 'GET', data || '', header)
  }

  /**
   * 发送post请求
   * @param url {string} 请求url地址
   * @param data {IHttpData} 请求数据
   * @param header {object} 请求头部信息
   * @returns {Promise} 返回一个Promise对象
   */
  public post(url, data, header) {
    return this.createAjax(url, 'POST', data || '', header)
  }

  /**
   * 创建ajax方法
   * @param url {string} 请求url地址
   * @param method {IMethod} 发送方式
   * @param data {IHttpData} 请求数据
   * @param header {object} 请求头部信息
   * @returns {Promise} 返回一个Promise对象
   */
  private createAjax(url: string, method: IMethod, data: IHttpData, header: object) {
    // 通过这种方式，来达到打包时报错和在nodejs下无法发送的问题。详情可见: https://github.com/BlackHole1/rollup-axios-error-demo
    const request = (url.indexOf('http://') === 0) ? require('http') : require('https')
    return new Promise((resolve, reject) => {
      const ajax = request.request(this.urlToOptions(url, method, data, header), resp => {
        if (Math.floor(resp.statusCode / 100) !== 2) {
          reject(resp.statusCode)
        }
        resp.on('data', chunk => {
          resolve(chunk.toString())
        })
      }).setTimeout(3000, () => {
        ajax.abort()
      }).on('abort', e => {
        reject(`当前日志超时3秒，未被发送。当前日志为:${data}`)
      }).on('error', e => {
        reject(e)
      })
      ajax.write(data)
      ajax.end()
    })
  }

  /**
   * 把url地址转成options
   * @param url {string} url地址
   * @param method {IMethod} 发送方式
   * @param data {IHttpData} 请求数据
   * @param header {object} 请求头部信息
   * @returns object
   */
  private urlToOptions(url: string, method: IMethod, data: IHttpData, header: object = {}) {
    const URL = require('url').URL
    const { hostname, port, protocol, pathname } = new URL(url)
    return {
      hostname: hostname,
      port: Number(port) || protocol === 'http:' ? 80 : 443,
      path: pathname,
      method: method,
      headers: {
        ...header,
        'Content-Length': Buffer.byteLength(data)
      }
    }
  }
}
