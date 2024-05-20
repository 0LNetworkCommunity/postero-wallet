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

export enum PendingTransactionsServiceEvent {
  NewPendingTransaction = "NewPendingTransaction",
  PendingTransactionRemoved = "PendingTransactionRemoved",
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

  newPendingTransaction(
    sender: Uint8Array,
    transactionPayload: Uint8Array,
    maxGasUnit: bigint,
    gasPrice: bigint,
    expirationTimestamp: bigint,
  ): Promise<void>;
}

export interface IPendingTransaction {
  id: string;
  dApp: IDApp;
  type: string;
  payload: Buffer;
  createdAt: Date;
  init(
    id: string,
    dApp: IDApp,
    type: string,
    payload: Buffer,
    createdAt: Date,
  ): void;
}

export interface IPendingTransactionFactory {
  getPendingTransaction(
    id: string,
    dApp: IDApp,
    type: RawPendingTransactionPayloadType,
    payload: Buffer,
    createdAt: Date,
  ): Promise<IPendingTransaction>;
}

export interface IPendingTransactionsRepository {
  createPendingTransaction(
    sender: Uint8Array,
    transactionPayload: Uint8Array,
    maxGasUnit: bigint,
    gasPrice: bigint,
    expirationTimestamp: bigint,
  ): Promise<IPendingTransaction>;
  getPendingTransaction(id: string): Promise<IPendingTransaction | null>;
  getPendingTransactions(): Promise<IPendingTransaction[]>;
  removePendingTransaction(id: string): Promise<void>;
}
