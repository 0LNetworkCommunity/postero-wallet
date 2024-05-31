export interface Settings {
  rpcUrl: string;
  chainId: number;
  maxGasUnit: number;
  gasPricePerUnit: number;
}

export enum SettingsKey {
  RpcUrl = 'RpcUrl',
  ChainId = 'ChainId',
  MaxGasUnit = 'MaxGasUnit',
  GasPricePerUnit = 'GasPricePerUnit',
}