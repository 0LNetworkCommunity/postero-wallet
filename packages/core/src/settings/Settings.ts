import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum SettingsKey {
  RpcUrl = 'RpcUrl',
  ChainId = 'ChainId',
  MaxGasUnit = 'MaxGasUnit',
  GasPricePerUnit = 'GasPricePerUnit',
}

registerEnumType(SettingsKey, {
  name: "SettingsKey",
});

export interface SettingsValue {
  rpcUrl: string;
  chainId: number;
  maxGasUnit: number;
  gasPricePerUnit: number;
}

@ObjectType('Settings')
class Settings {
  @Field()
  public rpcUrl: string;

  @Field()
  public chainId: number;

  @Field()
  public maxGasUnit: number;

  @Field()
  public gasPricePerUnit: number;

  public init(value: SettingsValue) {
    this.rpcUrl = value.rpcUrl;
    this.chainId = value.chainId;
    this.maxGasUnit = value.maxGasUnit;
    this.gasPricePerUnit = value.gasPricePerUnit;
  }
}

export default Settings;
