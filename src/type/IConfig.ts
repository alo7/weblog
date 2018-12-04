import { IEnv, ISendMode, ICacheSpace } from './IProperty'
import IApp from './IApp'
import IUser from './IUser'

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
