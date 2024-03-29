import { Types } from "aptos";

export interface IOpenLibraService {
  getOriginatingAddress(authenticationKey: Uint8Array): Promise<Uint8Array>;

  getAccountResources(
    accountAddress: Uint8Array,
  ): Promise<Types.MoveResource[]>;

  getAccountResource(
    accountAddress: Uint8Array,
    resourceType: string,
  ): Promise<Types.MoveResource>;
}
