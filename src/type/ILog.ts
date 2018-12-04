import IOs from './IOs'
import IDevice from './IDevice'
import IClient from './IClient'
import IApp from './IApp'
import IUser from './IUser'

export default interface ILog {
  env: string;
  userAgent: string;
  os: IOs;
  device: IDevice;
  client: IClient;
  app: IApp;
  user: IUser | {};
}
