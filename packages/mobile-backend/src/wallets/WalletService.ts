import Emittery, { UnsubscribeFn } from "emittery";
import { Inject, Injectable } from '@nestjs/common';

import {
  IWalletRepository,
  IWalletService,
  WalletServiceEvent,
} from './interfaces';
import { Types } from '../types';
import { ICryptoService } from '../crypto/interfaces';
import Wallet from "../crypto/Wallet";
import { IDbService } from "../db/interfaces";
import Balance from "./Balance";

@Injectable()
class WalletService implements IWalletService {
  syncWallet(walletId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  importWallet(mnemonic: string): Promise<Wallet> {
    throw new Error("Method not implemented.");
  }

  setWalletLabel(walletId: string, label: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getWallet(walletId: string): Promise<Wallet> {
    throw new Error("Method not implemented.");
  }

  getWalletPrivateKey(walletId: string): Promise<Uint8Array> {
    throw new Error("Method not implemented.");
  }

  getWalletBalances(walletId: string): Promise<Balance[]> {
    throw new Error("Method not implemented.");
  }

  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(Types.ICryptoService)
  private readonly cryptoService: ICryptoService;

  @Inject(Types.IWalletRepository)
  private readonly walletRepository: IWalletRepository;

  private eventEmitter = new Emittery();

  public async newWallet(): Promise<Wallet> {
    const cryptoWallet = await this.cryptoService.newWallet();
    const wallet = await this.walletRepository.saveWallet(cryptoWallet);
    this.eventEmitter.emit(WalletServiceEvent.NewWallet, wallet);
    return wallet;
  }

  public async deleteWallet(id: string) {
    await this.dbService.db("wallets").where("id", id).del();
    this.eventEmitter.emit(WalletServiceEvent.WalletRemoved, id);
  }

  public on(
    eventName: WalletServiceEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(eventName, listener);
  }
}

export default WalletService;
