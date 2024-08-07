import { UnsubscribeFn } from "emittery";

import { Balance } from "./Balance";
import Coin from "../coin/Coin";
import { ICoin } from "../coin/interfaces";

export enum WalletServiceEvent {
  NewWallet = "NewWallet",
  WalletRemoved = "WalletRemoved",
  WalletUpdated = "WalletUpdated",
}

export interface IWalletRepository {
  getWallet(address: Uint8Array): Promise<IGraphQLWallet | null>;
  getWallets(): Promise<IGraphQLWallet[]>;
  saveWallet(address: Uint8Array, authKey: Uint8Array): Promise<IGraphQLWallet>;
  saveWalletAuthKey(
    address: Uint8Array,
    authKey: Uint8Array,
  ): Promise<void>;
  setWalletLabel(address: Uint8Array, label: string): Promise<void>;
  getWalletsFromAuthKey(authKey: Uint8Array): Promise<IGraphQLWallet[]>;
}

export interface IWalletService {
  syncWallet(address: Uint8Array): Promise<void>;

  importMnemonic(mnemonic: string): Promise<IGraphQLWallet>;
  importPrivateKey(privateKey: Uint8Array): Promise<IGraphQLWallet>;

  deleteWallet(walletAddress: Uint8Array): Promise<void>;
  setWalletLabel(walletAddress: Uint8Array, label: string): Promise<void>;
  getWalletBalances(walletAddress: Uint8Array): Promise<Balance[]>;
  getSlowWallet(walletAddress: Uint8Array): Promise<ISlowWallet | undefined>;
  setSlow(address: Uint8Array): Promise<Uint8Array>;

  getWalletsFromAuthKey(authKey: Uint8Array): Promise<IGraphQLWallet[]>;
  getWallets(): Promise<IGraphQLWallet[]>;

  on(
    eventName: WalletServiceEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn;
}

export interface IGraphQLWallet {
  label: string;
  address: Uint8Array;
  init(
    label: string,
    address: Uint8Array,
  ): void;
}

export interface IGraphQLWalletFactory {
  getGraphQLWallet(
    label: string,
    address: Uint8Array,
  ): Promise<IGraphQLWallet>;
}

export interface ISlowWalletFactory {
  getSlowWallet(transferred: string, unlocked: string): Promise<ISlowWallet>;
}

export interface IBalanceFactory {
  createBalance(amount: string, coin: Coin): Promise<Balance>;
}

export interface IBalanceRepository {
  getBalances(walletAddress: Uint8Array): Promise<Balance[]>;
}

export interface IBalance {
  amount: string;
  coin: ICoin;
  init(amount: string, coin: ICoin): void;
}

export interface ISlowWallet {
  transferred: string;
  unlocked: string;
  init(transferred: string, unlocked: string): void;
}
