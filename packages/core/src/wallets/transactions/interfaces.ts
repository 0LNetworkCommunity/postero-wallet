import { registerEnumType } from "@nestjs/graphql";
import { UnsubscribeFn } from "emittery";
import BN from "bn.js";
import { AbstractTransaction, AbstractTransactionInput } from "./AbstractTransaction";

export enum RawPendingTransactionPayloadType {
  EntryFunctionPayload = "entry_function_payload",
}

export interface RawPendingTransactionPayload {
  type: RawPendingTransactionPayloadType;
  payload: string;
  sender: Uint8Array;
}

export interface ITransactionsService {
  getUserTransactionsByVersion(versions: string[]): Promise<IUserTransaction[]>;
  createUserTransactions(
    rawTransactions: RawUserTransaction[],
  ): Promise<IUserTransaction[]>;
}

export interface RawUserTransaction {
  version: string;
  timestamp: string;
  success: boolean;
  sender: Uint8Array;
  hash: Uint8Array;
  moduleAddress: Uint8Array;
  moduleName: string;
  functionName: string;
  arguments: string;
}

export interface ITransactionsRepository {
  getTransactionByHash(hash: Uint8Array): Promise<AbstractTransaction | null>;
  getUserTransactionsByVersion(versions: string[]): Promise<IUserTransaction[]>;
  createUserTransactions(
    rawTransactions: RawUserTransaction[],
  ): Promise<IUserTransaction[]>;
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
    transaction: RawPendingTransactionPayload,
  ): Promise<IPendingTransaction>;
  getWalletPendingTransactions(
    address: Uint8Array,
  ): Promise<IPendingTransaction[]>;
  getPendingTransaction(id: string): Promise<IPendingTransaction | null>;
  getPendingTransactions(): Promise<IPendingTransaction[]>;
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

  setPendingTransactionStatus(
    hash: Uint8Array,
    status: PendingTransactionStatus,
  ): Promise<void>;
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
  getWalletPendingTransactions(
    address: Uint8Array,
  ): Promise<IPendingTransaction[]>;
  removePendingTransaction(id: string): Promise<void>;
  setPendingTransactionHash(id: string, hash: Uint8Array): Promise<void>;
  setPendingTransactionStatus(
    id: string,
    status: PendingTransactionStatus,
  ): Promise<void>;
  getTransactionsExpiredAfter(
    timestamp: number,
    limit: number,
  ): Promise<IPendingTransaction[]>;
}

export interface ITransactionFactory {
  createUserTransaction(args: UserTransactionInput): Promise<IUserTransaction>;
}

export type UserTransactionInput = AbstractTransactionInput & {
  sender: Uint8Array;
  hash: Uint8Array;
  success: boolean;
  moduleAddress: Uint8Array;
  moduleName: string;
  functionName: string;
  arguments: string;
  timestamp: BN;
};

export interface IUserTransaction {
  version: BN;
  timestamp: BN;
  success: boolean;
  sender: Uint8Array;
  moduleAddress: Uint8Array;
  moduleName: string;
  functionName: string;
  arguments: string;

  init(input: UserTransactionInput): void;
}

export enum TransactionsWatcherServiceEvent {
  PendingTransaction = "PendingTransaction",
}

export interface ITransactionsWatcherService {
  on(
    event: TransactionsWatcherServiceEvent.PendingTransaction,
    listener: (data: {
      address: Uint8Array;
      status: PendingTransactionStatus;
      hash: Uint8Array;
    }) => void | Promise<void>,
  ): UnsubscribeFn;
}

export interface ITransactionWatcher {
  address: Uint8Array;

  init(address: Uint8Array): void;
  destroy(): Promise<void>;

  on(
    event: TransactionWatcherEvent.PendingTransaction,
    listener: (data: {
      status: PendingTransactionStatus;
      hash: Uint8Array;
    }) => void | Promise<void>,
  ): UnsubscribeFn;

  on(
    event: TransactionWatcherEvent.Transaction,
    listener: (transaction: AbstractTransaction) => void | Promise<void>,
  ): UnsubscribeFn;
}

export interface ITransactionWatcherFactory {
  getWatcher(address: Uint8Array): Promise<ITransactionWatcher>;
}

export enum TransactionWatcherEvent {
  PendingTransaction = "PendingTransaction",
  Transaction = "Transaction",
}

export enum PendingTransactionsUpdaterServiceEvent {
  UpdatingTransaction = "UpdatingTransaction",
  TransactionUpdated = "TransactionUpdated",
}

export interface IPendingTransactionsUpdaterService {
  transactionUpdating(pendingTransaction: IPendingTransaction): boolean;
  updateTransaction(transaction: IPendingTransaction): Promise<void>;

  on(
    event: PendingTransactionsUpdaterServiceEvent.UpdatingTransaction,
    listener: (pendingTransaction: IPendingTransaction) => void | Promise<void>,
  ): UnsubscribeFn;
  on(
    event: PendingTransactionsUpdaterServiceEvent.TransactionUpdated,
    listener: (pendingTransaction: IPendingTransaction) => void | Promise<void>,
  ): UnsubscribeFn;
}