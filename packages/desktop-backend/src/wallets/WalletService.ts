import Emittery, { UnsubscribeFn } from "emittery";
import { Inject, Injectable } from "@nestjs/common";
import { systemPreferences } from "electron";

import {
  IWalletService,
  IWalletRepository,
  IBalanceRepository,
  IBalance,
  WalletServiceEvent,
} from "./interfaces";
import { ICryptoService } from "../crypto/interfaces";
import { IOpenLibraService } from "../open-libra/interfaces";
import AccountAddress from "../crypto/AccountAddress";
import Wallet from "../crypto/Wallet";
import { ICoinRepository } from "../coin/interfaces";
import { IDbService } from "../db/interfaces";
import { Types } from "../types";

function ConfirmUserPresence(message: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        await systemPreferences.promptTouchID(message);
        return originalMethod.apply(this, args);
      } catch (err) {}
      return null;
    };

    return descriptor;
  };
}

@Injectable()
class WalletService implements IWalletService {
  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(Types.IWalletRepository)
  private readonly walletRepository: IWalletRepository;

  @Inject(Types.ICryptoService)
  private readonly cryptoService: ICryptoService;

  @Inject(Types.IOpenLibraService)
  private readonly openLibraService: IOpenLibraService;

  @Inject(Types.ICoinRepository)
  private readonly coinRepository: ICoinRepository;

  @Inject(Types.IBalanceRepository)
  private readonly balanceRepository: IBalanceRepository;

  private eventEmitter = new Emittery();

  public async getWallet(id: string): Promise<Wallet | null> {
    return this.walletRepository.getWallet(id);
  }

  @ConfirmUserPresence("retreive a wallet private key")
  public async getWalletPrivateKey(id: string): Promise<Uint8Array | null> {
    return this.walletRepository.getWalletPrivateKey(id);
  }

  public async importWallet(mnemonic: string): Promise<Wallet> {
    const cryptoWallet = await this.cryptoService.walletFromMnemonic(mnemonic);
    const address = await this.openLibraService.getOriginatingAddress(
      cryptoWallet.authenticationKey.bytes,
    );
    cryptoWallet.accountAddress = new AccountAddress(address);
    const wallet = await this.walletRepository!.saveWallet(cryptoWallet);
    await this.syncWallet(wallet.id);

    this.eventEmitter.emit(WalletServiceEvent.NewWallet, wallet);

    return wallet;
  }

  public async newWallet(): Promise<Wallet> {
    const cryptoWallet = await this.cryptoService.newWallet();
    const wallet = await this.walletRepository.saveWallet(cryptoWallet);
    console.log("wallet", wallet);
    this.eventEmitter.emit(WalletServiceEvent.NewWallet, wallet);
    return wallet;
  }

  public async syncWallet(id: string) {
    const wallet = await this.walletRepository.getWallet(id);
    if (wallet) {
      const resources = await this.openLibraService.getAccountResources(
        wallet.accountAddress,
      );

      for (const resource of resources) {
        if (resource.type.startsWith("0x1::coin::CoinStore<")) {
          const coinType = resource.type.substring(
            "0x1::coin::CoinStore<".length,
            resource.type.length - 1,
          );

          const data = resource.data as {
            coin: { value: string };
          };

          const coin = await this.coinRepository.getOrCreateCoin(coinType);

          await this.dbService
            .db("balances")
            .insert({
              coinId: coin.id,
              walletId: wallet.id,
              amount: data.coin.value,
            })
            .onConflict(["coinId", "walletId"])
            .merge(["amount"]);
        }
      }
    }
  }

  @ConfirmUserPresence("delete a wallet")
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

  public async setWalletLabel(walletId: string, label: string) {
    await this.walletRepository.setWalletLabel(walletId, label);
    const wallet = await this.walletRepository.getWallet(walletId);
    if (wallet) {
      this.eventEmitter.emit(WalletServiceEvent.WalletUpdated, wallet);
    }
  }

  public async getWalletBalances(walletId: string): Promise<IBalance[]> {
    return this.balanceRepository.getBalances(walletId);
  }
}

export default WalletService;
