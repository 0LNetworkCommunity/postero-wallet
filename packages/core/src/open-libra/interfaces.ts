import { AptosClient, Types } from "aptos";

export interface IOpenLibraService {
  rpcHost: string;

  aptosClient: AptosClient;

  getOriginatingAddress(authenticationKey: Uint8Array): Promise<Uint8Array>;

  getAccountResources(
    accountAddress: Uint8Array,
  ): Promise<Types.MoveResource[]>;

  getAccountResource(
    accountAddress: Uint8Array,
    resourceType: string,
  ): Promise<Types.MoveResource>;

  getAccount(
    address: Uint8Array,
  ): Promise<{ sequenceNumber: bigint; authKey: Uint8Array }>;
}
