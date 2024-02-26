import { UnsubscribeFn } from "emittery";

import Wallet from "../crypto/Wallet";
import { CryptoWallet } from "../crypto/interfaces";
import { Balance } from "./Balance";
import Coin from "../coin/Coin";
import { ICoin } from "../coin/interfaces";

export enum WalletServiceEvent {
  NewWallet = "NewWallet",
  WalletRemoved = "WalletRemoved",
  WalletUpdated = "WalletUpdated",
}

export interface IWalletRepository {
  getWallet(id: string): Promise<Wallet | null>;
  deleteWallet(id: string): Promise<void>;
  getWallets(): Promise<Wallet[]>;
  saveWallet(wallet: CryptoWallet): Promise<Wallet>;
  setWalletLabel(walletId: string, label: string): Promise<void>;
  getWalletPrivateKey(id: string): Promise<Uint8Array | null>;
}

export interface IWalletService {
  syncWallet(walletId: string): Promise<void>;
  importWallet(mnemonic: string): Promise<Wallet>;
  newWallet(): Promise<Wallet>;
  deleteWallet(id: string): Promise<void>;
  setWalletLabel(walletId: string, label: string): Promise<void>;
  getWallet(walletId: string): Promise<Wallet | null>;
  getWalletPrivateKey(walletId: string): Promise<Uint8Array | null>;
  getWalletBalances(walletId: string): Promise<Balance[]>;

  on(
    eventName: WalletServiceEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn;
}

export interface IGraphQLWallet {
  id: string;
  label: string;
  publicKey: Uint8Array;
  authenticationKey: Uint8Array;
  accountAddress: Uint8Array;

  init(
    id: string,
    label: string,
    publicKey: Uint8Array,
    authenticationKey: Uint8Array,
    accountAddress: Uint8Array,
  ): void;
}

export interface IGraphQLWalletFactory {
  getGraphQLWallet(
    id: string,
    label: string,
    publicKey: Uint8Array,
    authenticationKey: Uint8Array,
    accountAddress: Uint8Array,
  ): Promise<IGraphQLWallet>;
}

export interface IBalanceFactory {
  createBalance(amount: string, coin: Coin): Promise<Balance>;
}

export interface IBalanceRepository {
  getBalances(walletId: string): Promise<Balance[]>;
}

export interface IBalance {
  amount: string;
  coin: ICoin;
  init(amount: string, coin: ICoin): void;
}