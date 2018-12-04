import ILog from './ILog'

export type IEnv = string

export type ISendMode = 'immediately' | 'delay' | 'amount'

export type ICacheSpace = number

export type ILevel = 'debug' | 'info' | 'warn' | 'error'

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
