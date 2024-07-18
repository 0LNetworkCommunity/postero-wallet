import { registerEnumType } from "@nestjs/graphql";
import { UnsubscribeFn } from "emittery";
import BN from "bn.js";
import { AbstractTransaction, AbstractTransactionInput } from "./AbstractTransaction";
import { IScriptUserTransaction, ScriptUserTransactionInput } from "./ScriptUserTransaction";
import { GenesisTransactionInput, IGenesisTransaction } from "./GenesisTransaction";
import { IUserTransaction, UserTransactionInput } from "./UserTransaction";
import { BlockMetadataTransactionInput, IBlockMetadataTransaction } from "./BlockMetadataTransaction";

export enum RawPendingTransactionPayloadType {
  EntryFunctionPayload = "entry_function_payload",
}

export interface RawPendingTransactionPayload {
  type: RawPendingTransactionPayloadType;
  payload: string;
  sender: Uint8Array;
}

export interface ITransactionsService {
  getUserTransactionsByVersion(versions: BN[]): Promise<IUserTransaction[]>;
  createUserTransactions(
    rawTransactions: RawUserTransaction[],
  ): Promise<IUserTransaction[]>;
  getTransactionsByVersions(versions: BN[]): Promise<AbstractTransaction[]>;
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
  getTransactionByVersion(version: BN): Promise<AbstractTransaction | null>;
  getTransactionByHash(hash: Uint8Array): Promise<AbstractTransaction | null>;
  getUserTransactionsByVersions(versions: BN[]): Promise<IUserTransaction[]>;
  createUserTransactions(
    rawTransactions: RawUserTransaction[],
  ): Promise<IUserTransaction[]>;
  getTransactionsByVersions(versions: BN[]): Promise<AbstractTransaction[]>;
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
  getPendingTransaction(hash: Uint8Array): Promise<IPendingTransaction | null>;
  getPendingTransactions(): Promise<IPendingTransaction[]>;
  removePendingTransaction(hash: Uint8Array): Promise<void>;
  on(
    event: PendingTransactionsServiceEvent.NewPendingTransaction,
    listener: (pendingTransaction: IPendingTransaction) => void,
  ): UnsubscribeFn;
  on(
    event: PendingTransactionsServiceEvent.PendingTransactionRemoved,
    listener: (pendingTransactionHash: Uint8Array) => void,
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
  ): Promise<Uint8Array>;

  setPendingTransactionStatus(
    hash: Uint8Array,
    status: PendingTransactionStatus,
  ): Promise<void>;
}

export interface PendingTransactionArgs {
  payload: Buffer;
  hash: Uint8Array;
  status: PendingTransactionStatus;
  createdAt: Date;
  expirationTimestamp: number;
}

export interface IPendingTransaction {
  payload: Buffer;
  createdAt: Date;
  hash: Uint8Array;
  status?: PendingTransactionStatus;
  expirationTimestamp: number;
  sender: Uint8Array;
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
  ): Promise<Uint8Array>;
  getPendingTransaction(hash: Uint8Array): Promise<IPendingTransaction | null>;
  getPendingTransactions(): Promise<IPendingTransaction[]>;
  getWalletPendingTransactions(
    address: Uint8Array,
  ): Promise<IPendingTransaction[]>;
  removePendingTransaction(hash: Uint8Array): Promise<void>;
  setPendingTransactionStatus(
    hash: Uint8Array,
    status: PendingTransactionStatus,
  ): Promise<void>;
  getTransactionsExpiredAfter(
    timestamp: number,
    limit: number,
  ): Promise<IPendingTransaction[]>;
}

export interface ITransactionFactory {
  createUserTransaction(args: UserTransactionInput): Promise<IUserTransaction>;
  createGenesisTransaction(
    input: GenesisTransactionInput,
  ): Promise<IGenesisTransaction>;
  createScriptUserTransaction(
    input: ScriptUserTransactionInput,
  ): Promise<IScriptUserTransaction>;
  createBlockMetadataTransaction(
    input: BlockMetadataTransactionInput,
  ): Promise<IBlockMetadataTransaction>;
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