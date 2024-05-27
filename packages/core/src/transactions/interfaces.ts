import { registerEnumType } from "@nestjs/graphql";
import { UnsubscribeFn } from "emittery";
import { IDApp } from "../dapps/interfaces";

export enum RawPendingTransactionPayloadType {
  EntryFunctionPayload = "entry_function_payload",
}

export interface RawPendingTransactionPayload {
  type: RawPendingTransactionPayloadType;
  payload: string;
  sender: Uint8Array;
}

export interface ITransactionsService {

}

export interface ITransactionsRepository {
}

export interface ITransaction {
  id: string;
}

export enum PendingTransactionStatus {
  Unknown = "UNKNOWN",
  OnChain = "ON_CHAIN",
  Expired = "EXPIRED",
}

registerEnumType(PendingTransactionStatus, { name: 'PendingTransactionStatus' });

export enum PendingTransactionsServiceEvent {
  NewPendingTransaction = "NewPendingTransaction",
  PendingTransactionRemoved = "PendingTransactionRemoved",
  PendingTransactionUpdated = "PendingTransactionUpdated",
}

export interface IPendingTransactionsService {
  newTransaction(
    dApp: IDApp,
    transaction: RawPendingTransactionPayload,
  ): Promise<IPendingTransaction>;
  getPendingTransaction(id: string): Promise<IPendingTransaction | null>;
  getPendingTransactions(): Promise<IPendingTransaction[]>;
  sendPendingTransaction(
    pendingTransactionId: string,
    walletAddress: Uint8Array,
    gasPrice: number,
    maxGasUnit: number,
    timeout: number,
  ): Promise<Uint8Array | null>;
  removePendingTransaction(id: string): Promise<void>;
  on(
    event: PendingTransactionsServiceEvent.NewPendingTransaction,
    listener: (pendingTransaction: IPendingTransaction) => void,
  ): UnsubscribeFn;
  on(
    event: PendingTransactionsServiceEvent.PendingTransactionRemoved,
    listener: (pendingTransactionId: string) => void,
  ): UnsubscribeFn;
  on(
    event: PendingTransactionsServiceEvent.PendingTransactionUpdated,
    listener: (pendingTransaction: IPendingTransaction) => void,
  ): UnsubscribeFn;

  newPendingTransaction(
    sender: Uint8Array,
    transactionPayload: Uint8Array,
    maxGasUnit: bigint,
    gasPrice: bigint,
    expirationTimestamp: bigint,
  ): Promise<string>;
}

export interface PendingTransactionArgs {
  id: string;
  type: string;
  payload: Buffer;
  hash?: Uint8Array;
  status: PendingTransactionStatus;
  createdAt: Date;
  expirationTimestamp: number;
}

export interface IPendingTransaction {
  id: string;
  type: string;
  payload: Buffer;
  createdAt: Date;
  hash?: Uint8Array;
  status?: PendingTransactionStatus;
  expirationTimestamp: number;
  init(args: PendingTransactionArgs): void;
}

export interface IPendingTransactionFactory {
  getPendingTransaction(
    args: PendingTransactionArgs,
  ): Promise<IPendingTransaction>;
}

export interface IPendingTransactionsRepository {
  createPendingTransaction(
    sender: Uint8Array,
    transactionPayload: Uint8Array,
    maxGasUnit: bigint,
    gasPrice: bigint,
    expirationTimestamp: bigint,
  ): Promise<string>;
  getPendingTransaction(id: string): Promise<IPendingTransaction | null>;
  getPendingTransactionByHash(
    hash: Uint8Array,
  ): Promise<IPendingTransaction | null>;
  getPendingTransactions(): Promise<IPendingTransaction[]>;
  removePendingTransaction(id: string): Promise<void>;
  setPendingTransactionHash(id: string, hash: Uint8Array): Promise<void>;
  setPendingTransactionStatus(id: string, status: string): Promise<void>;
}
