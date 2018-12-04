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
