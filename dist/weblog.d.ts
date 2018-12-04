declare module 'weblog/src/type/IOs' {
	export default interface IOs {
	    name: string;
	    version: string;
	    network_type: string;
	    language: string;
	    payload: object;
	}

}
declare module 'weblog/src/type/IDevice' {
	export default interface IDevice {
	    manufacturer: string;
	    model: string;
	    type: string;
	    resolution: string;
	    name: string;
	    memory: number;
	    cpu: number;
	    machineId: string;
	    payload: object;
	}

}
declare module 'weblog/src/type/IClient' {
	export default interface IClient {
	    name: string;
	    version: string;
	    payload: object;
	}

}
declare module 'weblog/src/type/IApp' {
	export default interface IApp {
	    name: string;
	    version: string;
	    type: string;
	    channel: string;
	    build: string;
	    payload?: object;
	}

}
declare module 'weblog/src/type/IUser' {
	export default interface IUser {
	    id: string;
	    type: string;
	    payload?: object;
	}

}
declare module 'weblog/src/type/ILog' {
	import IOs from 'weblog/src/type/IOs';
	import IDevice from 'weblog/src/type/IDevice';
	import IClient from 'weblog/src/type/IClient';
	import IApp from 'weblog/src/type/IApp';
	import IUser from 'weblog/src/type/IUser';
	export default interface ILog {
	    env: string;
	    userAgent: string;
	    os: IOs;
	    device: IDevice;
	    client: IClient;
	    app: IApp;
	    user: IUser | {};
	}

}
declare module 'weblog/src/type/IProperty' {
	import ILog from 'weblog/src/type/ILog';
	export type IEnv = string;
	export type ISendMode = 'immediately' | 'delay' | 'amount';
	export type ICacheSpace = number;
	export type ILevel = 'debug' | 'info' | 'warn' | 'error';
	export interface ISendStrategy {
	    sendMode: ISendMode;
	    cacheSpace: ICacheSpace;
	}
	export interface IEventLog {
	    name: string;
	    value: string;
	    level?: ILevel;
	    payload?: object;
	}
	export interface IEventConfig {
	    behavior: string;
	    senders: string[];
	    isImmediately: boolean;
	}
	export interface ILogExtraInfo extends IEventLog {
	    timestamp: number;
	    uuid: string;
	    sessionId: string;
	}
	export interface ICompleteLog extends ILog {
	    timestamp: number;
	    uuid: string;
	    sessionId: string;
	    level: string;
	    payload: object;
	    event: {
	        name: string;
	        value: string;
	    };
	}

}
declare module 'weblog/src/storage/LocalStorageMethod' {
	export default class LocalStorageMethod {
	    /**
	     * 获取localStorage里某一指定key的值
	     * @param key {string} 获取哪个字段
	     * @returns {array} 返回数组，数组里是对象
	     */
	    getItem(key: string): object[];
	    /**
	     * 设置localStorage里某一指定key的值
	     * @param key {string} 要设置的字段
	     * @param val {object} 要设置的值
	     * @returns {array} 返回追加后的字段值
	     */
	    setItem(key: string, val: object): object[];
	    /**
	     * 往localStorage里某一指定key的值里追加内容
	     * @param key {string} 将要追加的字段
	     * @param val {object} 要追加的内容
	     * @returns {array} 返回追加后的字段值
	     */
	    push(key: string, val: object): object[];
	    /**
	     * 移除指定字段
	     * @param key 将要移除的字段
	     * @returns {void}
	     */
	    remove(key: string): void;
	    /**
	     * 情清空所有localStorage信息
	     * @returns {void}
	     */
	    clear(): void;
	}

}
declare module 'weblog/src/storage/ArrayStorageMethod' {
	export default class ArrayStorageMethod {
	    private logList;
	    constructor();
	    /**
	     * 获取logList里某一指定key的值
	     * @param key {string} 获取哪个字段
	     * @returns {array} 返回数组，数组里是对象
	     */
	    getItem(key: string): object[];
	    /**
	     * 设置logList里某一指定key的值
	     * @param key {string} 要设置的字段
	     * @param val {object} 要设置的值
	     * @returns {array} 返回追加后的字段值
	     */
	    setItem(key: string, val: object): object[];
	    /**
	     * 往logList里某一指定key的值里追加内容
	     * @param key {string} 将要追加的字段
	     * @param val {object} 要追加的内容
	     * @returns {array} 返回追加后的字段值
	     */
	    push(key: string, val: object): object[];
	    /**
	     * 移除指定字段
	     * @param key 将要移除的字段
	     * @returns {void}
	     */
	    remove(key: string): void;
	    /**
	     * 情清空所有logList信息
	     * @returns {void}
	     */
	    clear(): void;
	}

}
declare module 'weblog/src/type/IAjax' {
	export type IXhrData = string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream;
	export type IHttpData = string | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array | DataView | ArrayBuffer;
	export type IMethod = 'GET' | 'POST';

}
declare module 'weblog/src/ajax/xhr' {
	import { IXhrData } from 'weblog/src/type/IAjax';
	export default class Xhr {
	    /**
	     * 发送get请求
	     * @param url {string} 请求url地址
	     * @param data {IXhrData} 请求数据
	     * @param header {object} 请求头部信息
	     * @returns {Promise} 返回一个Promise对象
	     */
	    get(url: string, data: IXhrData, header: object): any;
	    /**
	     * 发送post请求
	     * @param url {string} 请求url地址
	     * @param data {IXhrData} 请求数据
	     * @param header {object} 请求头部信息
	     * @returns {Promise} 返回一个Promise对象
	     */
	    post(url: string, data: IXhrData, header: object): any;
	    /**
	     * 创建ajax方法
	     * @param url {string} 请求url地址
	     * @param method {IMethod} 发送方式
	     * @param data {IXhrData} 请求数据
	     * @param header {objct} 请求头部信息
	     * @returns {Promise} 返回一个Promise对象
	     */
	    private createAjax;
	    /**
	     * 设置头部信息
	     * 因为header是一个对象，需要转成xhr可以用的格式
	     * @param ajax {XMLHttpRequest} ajax对象
	     * @param header {object} 头部对象
	     * @returns void
	     */
	    private setHeader;
	}

}
declare module 'weblog/src/ajax/http' {
	export default class Http {
	    /**
	     * 发送get请求
	     * @param url {string} 请求url地址
	     * @param data {IHttpData} 请求数据
	     * @param header {object} 请求头部信息
	     * @returns {Promise} 返回一个Promise对象
	     */
	    get(url: any, data: any, header: any): any;
	    /**
	     * 发送post请求
	     * @param url {string} 请求url地址
	     * @param data {IHttpData} 请求数据
	     * @param header {object} 请求头部信息
	     * @returns {Promise} 返回一个Promise对象
	     */
	    post(url: any, data: any, header: any): any;
	    /**
	     * 创建ajax方法
	     * @param url {string} 请求url地址
	     * @param method {IMethod} 发送方式
	     * @param data {IHttpData} 请求数据
	     * @param header {object} 请求头部信息
	     * @returns {Promise} 返回一个Promise对象
	     */
	    private createAjax;
	    /**
	     * 把url地址转成options
	     * @param url {string} url地址
	     * @param method {IMethod} 发送方式
	     * @param data {IHttpData} 请求数据
	     * @param header {object} 请求头部信息
	     * @returns object
	     */
	    private urlToOptions;
	}

}
declare module 'weblog/src/type/IConsole' {
	export default interface IConsole {
	    debug: Function;
	    info: Function;
	    warn: Function;
	    error: Function;
	}

}
declare module 'weblog/src/common/utils' {
	import { ILevel } from 'weblog/src/type/IProperty';
	import LocalStorageMethod from 'weblog/src/storage/LocalStorageMethod';
	import ArrayStorageMethod from 'weblog/src/storage/ArrayStorageMethod';
	import Xhr from 'weblog/src/ajax/xhr';
	import Http from 'weblog/src/ajax/http';
	import IConsole from 'weblog/src/type/IConsole';
	/**
	 * 生成uuid
	 * @returns {string} 返回随机的uuid
	 */
	export const getUUID: () => string;
	/**
	 * 获取当前时间戳
	 * @returns {number} 返回时间戳
	 */
	export const getTimestamp: () => number;
	/**
	 * 判断当前运行环境是否为浏览器
	 * @returns {boolean} 如果是浏览器则返回true
	 */
	export const isBrowser: () => boolean;
	/**
	 * 判断数组里的值是否存在
	 * @param arr {array} 要检测的数组
	 * @param val {any} 要检测的值
	 * @returns {boolean} 数组里存在值时返回true
	 */
	export const includes: (arr: any[], val: any) => boolean;
	/**
	 * 判断参数是否为空
	 * @param params {array} 不限传参个数
	 * @returns {boolean} 有一个为空，就返回true
	 */
	export const isEmpty: (...params: any[]) => boolean;
	/**
	 * 打平对象
	 * 如果是多层嵌套对象，则打平成一层，以_连接
	 * @param payload {object} payload对象
	 * @returns {object} 返回最总打平的对象
	 */
	export const flattenPayload: (payload: object) => object;
	export const setConsole: (fun: IConsole) => void;
	/**
	 * 在控制台输出
	 * @param level {ILevel} 输出级别
	 * @param msg {string} 输出内容
	 * @returns {void} void
	 */
	export const message: (level: ILevel, msg: string) => void;
	/**
	 * 数组对象转字符串
	 * @param obj {Object} 要转化的数组对象
	 * @returns {string} 转化后的字符串
	 */
	export const stringify: (obj: object) => string;
	/**
	 * 字符串转数组对象
	 * @param str {string} 要转的字符串
	 * @returns {array} 转化后的数组
	 */
	export const parse: (str: string) => object[];
	export const getDeviceType: () => "pc" | "iphone" | "android" | "WindowsPhone" | "pad" | "unknown";
	/**
	 * 把ajax放在utils里，通过参数传入方式，引入到插件里。以便减少插件体积
	 */
	export const http: Xhr | Http;
	/**
	 * 根据不同的运行环境，返回不同的存储方法
	 */
	export const storage: LocalStorageMethod | ArrayStorageMethod;
	export const flat: any;

}
declare module 'weblog/src/type/IWebLog' {
	import { ISendStrategy } from 'weblog/src/type/IProperty';
	export default interface IWebLog {
	    setOsPayload(payload: object): void;
	    setDevicePayload(payload: object): void;
	    setClientPayload(payload: object): void;
	    setAppPayload(payload: object): void;
	    setUserPayload(payload: object): void;
	    setLogSupplementaryInfo(info: object): void;
	    setPlugins(plugins: object): void;
	    setSendStrategy({ sendMode, cacheSpace }: ISendStrategy): void;
	}

}
declare module 'weblog/src/common/getInfo' {
	import IOs from 'weblog/src/type/IOs';
	import IDevice from 'weblog/src/type/IDevice';
	import IClient from 'weblog/src/type/IClient';
	/**
	 * 获取user-agent信息
	 * @returns {string} 返回user-agent信息
	 */
	export const getInfoUA: () => string;
	/**
	 * 获取系统信息
	 * 区分浏览器还是Nodejs
	 * @param network_type 网络类型
	 * @returns {IOs} 返回系统信息
	 */
	export const getInfoOs: ({ network_type }: {
	    network_type: any;
	}) => IOs;
	/**
	 * 获取设备信息
	 * 参数以对象的方式传入
	 * @param name 设备名称
	 * @param resolution 分辨率
	 * @param uuid 设备唯一id
	 * @returns {IDevice} 返回设备信息
	 */
	export const getInfoDevice: ({ name, model, manufacturer, resolution, machineId, }: {
	    name: any;
	    model: any;
	    manufacturer: any;
	    resolution: any;
	    machineId: any;
	}) => IDevice;
	/**
	 * 获取起容器信息(浏览器信息 或 nodejs信息)
	 * @returns {IClient} 返回容器信息
	 */
	export const getInfoClient: () => IClient;

}
declare module 'weblog/src/type/IConfig' {
	import { IEnv, ISendMode, ICacheSpace } from 'weblog/src/type/IProperty';
	import IApp from 'weblog/src/type/IApp';
	import IUser from 'weblog/src/type/IUser';
	export default interface IConfig {
	    env: IEnv;
	    sendMode: ISendMode;
	    cacheSpace: ICacheSpace;
	    deviceModel: string;
	    manufacturer: string;
	    deviceName: string;
	    resolution: string;
	    machineId: string;
	    networkType: string;
	    app: IApp;
	    user: IUser;
	}

}
declare module 'weblog/src/type/IController' {
	import { ISendMode, ICacheSpace, ICompleteLog, IEventConfig } from 'weblog/src/type/IProperty';
	export default interface IController {
	    sendMode: ISendMode;
	    cacheSpace: ICacheSpace;
	    completeLog: ICompleteLog;
	    eventConfig: IEventConfig;
	    plugins: object;
	}

}
declare module 'weblog/src/common/config' {
	export const prefix = "WebLog_";

}
declare module 'weblog/src/controller/index' {
	import IController from 'weblog/src/type/IController'; const controller: ({ sendMode, cacheSpace, completeLog, eventConfig, plugins }: IController) => object;
	export default controller;

}
declare module 'weblog/src/validate/validateFormatLog' {
	import { ICompleteLog } from 'weblog/src/type/IProperty'; const validateFormatLog: (completeLog: ICompleteLog) => boolean;
	export default validateFormatLog;

}
declare module 'weblog/src/validate/validateFormatPlugins' {
	 const _default: (plugins: object) => boolean;
	export default _default;

}
declare module 'weblog/src/validate/validateFormatEvent' {
	import { IEventConfig, ILevel } from 'weblog/src/type/IProperty'; const _default: (name: string, value: string, payload: object, level: ILevel, eventConfig: IEventConfig) => boolean;
	export default _default;

}
declare module 'weblog/src/validate/validateForConsole' {
	import IConsole from 'weblog/src/type/IConsole'; const _default: (fun: IConsole) => boolean;
	export default _default;

}
declare module 'weblog/src/index' {
	import IWebLog from 'weblog/src/type/IWebLog';
	import IUser from 'weblog/src/type/IUser';
	import ILog from 'weblog/src/type/ILog';
	import { ISendStrategy, IEventConfig, ILevel } from 'weblog/src/type/IProperty';
	import IConfig from 'weblog/src/type/IConfig';
	import IConsole from 'weblog/src/type/IConsole';
	export default class WebLog implements IWebLog {
	    private _env;
	    private _log;
	    private _ua;
	    private _os;
	    private _device;
	    private _client;
	    private _app;
	    private _user;
	    private _sendMode;
	    private _cacheSpace;
	    private _plugins;
	    private _sessionId;
	    constructor(config: IConfig);
	    /**
	     * 设置发送模式
	     * 参数以对象的方式传入
	     * @param sendMode {ISendMode} 设置发送模式
	     * @param cacheSpace {ICacheSpace} 设置缓存大小
	     * @returns void
	     */
	    setSendStrategy({ sendMode, cacheSpace }: ISendStrategy): void;
	    /**
	     * 设置调用哪些插件
	     * @param plugins {object} 插件
	     * @returns void
	     */
	    setPlugins(plugins: object): void;
	    /**
	     * 设置日志的补充信息
	     * 只支持设置deviceModel、manufacturer、resolution、networkType、env
	     * @param info {object} 设置补充的信息对象。
	     * @returns void
	     */
	    setLogSupplementaryInfo(info: object): void;
	    /**
	     * 设置系统的额外信息
	     * @param payload {object} 要添加的额外信息
	     * @returns void
	     */
	    setOsPayload(payload: object): void;
	    /**
	     * 设置设备的额外信息
	     * @param payload {object} 要添加的额外信息
	     * @returns void
	     */
	    setDevicePayload(payload: object): void;
	    /**
	     * 设置容器的额外信息
	     * @param payload {object} 需要添加的额外信息
	     * @returns void
	     */
	    setClientPayload(payload: object): void;
	    /**
	     * 设置应用的额外信息
	     * @param payload { object } 需要添加的额外信息
	     * @returns void
	     */
	    setAppPayload(payload: object): void;
	    /**
	     * 设置用户信息
	     * 参数以对象的方式传入
	     * @param id {string} 用户id
	     * @param type {string} 用户类型
	     * @param payload {object} 额外信息(可选)
	     * @returns void
	     */
	    setUser({ id, type, payload }?: IUser): void;
	    /**
	     * 设置用户的额外信息
	     * @param payload {object} 需要添加的额外信息
	     * @returns void
	     */
	    setUserPayload(payload: object): void;
	    getLog(): ILog;
	    /**
	     * 设置console函数，用于接替weblog自身的console
	     * @param fun {IConsole} 将要设置的方法
	     * @return void
	     */
	    setConsole(fun: IConsole): void;
	    /**
	     * 无视发送规则，直接把缓存里的日志全部发送
	     * 此api，用于当用户关闭网站/应用时触发
	     * @param cb {function} 发送完成之后调用的回调函数
	     * @return void
	     */
	    sendAll(cb?: Function): void;
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
	    event(name: string, value: string, payload: object, level: ILevel, eventConfig: IEventConfig): object;
	    /**
	     * 设置基本日志格式
	     * @returns void
	     */
	    private setLog;
	    /**
	     * 设置日志的额外信息
	     * @param extraInfo {ILogExtraInfo} 额外信息
	     * @returns {ICompleteLog} 返回日志库生成的完整日志
	     */
	    private setLogExtraInfo;
	    /**
	     * 设置App信息
	     * @param app {IApp} 设置app信息
	     * @returns void
	     */
	    private setApp;
	    private getClientPayload;
	}

}
