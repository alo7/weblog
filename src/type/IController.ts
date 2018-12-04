import { ISendMode, ICacheSpace, ICompleteLog, IEventConfig } from './IProperty'

export default interface IController {
  sendMode: ISendMode;
  cacheSpace: ICacheSpace;
  completeLog: ICompleteLog;
  eventConfig: IEventConfig;
  plugins: object;
}
