export default interface IApp {
  name: string;
  version: string;
  type: string;
  channel: string;
  build: string;
  payload?: object;
}
