import { ISendStrategy } from './IProperty'

export default interface IWebLog {
  setOsPayload(payload: object): void;
  setDevicePayload(payload: object): void;
  setClientPayload(payload: object): void;
  setAppPayload(payload: object): void;
  setUserPayload(payload: object): void;
  setLogSupplementaryInfo(info: object): void;
  setPlugins(plugins: object): void;
  setSendStrategy({ sendMode, cacheSpace }: ISendStrategy): void
}
