import { Inject, Injectable } from "@nestjs/common";
import { IWalletRepository } from "./interfaces";
import { Types } from "../types";
import { IDbService } from "../db/interfaces";
import { PlatformTypes } from "../platform/platform-types";
import Wallet from "../crypto/Wallet";
import { PlatformEncryptedStoreService, PlatformCryptoService } from "../platform/interfaces";

@Injectable()
class WalletRepository implements IWalletRepository {
  deleteWallet(address: Uint8Array): Promise<void> {
    throw new Error('Method not implemented.');
  }

  setWalletLabel(address: Uint8Array, label: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getWalletPrivateKey(address: Uint8Array): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }

  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(PlatformTypes.CryptoService)
  private readonly platformCryptoService: PlatformCryptoService;

  @Inject(PlatformTypes.EncryptedStoreService)
  private readonly platformEncryptedStoreService: PlatformEncryptedStoreService;

  public async saveWallet(
    address: Uint8Array,
    authKey: Uint8Array,
  ): Promise<Wallet> {
    const [{ total }] = await this.dbService
      .db('wallets')
      .count('*', { as: 'total' });

    const addressLit = this.dbService.raw(address);

    await this.dbService.db.transaction(async (trx) => {
      await this.dbService
        .db('wallets')
        .insert({
          address: addressLit,
          authKey: this.dbService.raw(authKey),
          label: `Wallet #${(total as number) + 1}`,
        })
        .onConflict('address')
        .ignore()
        .transacting(trx);

      await this.dbService
        .db('walletsAuthKeys')
        .insert({
          walletAddress: this.dbService.raw(address),
          authKey: this.dbService.raw(authKey),
        })
        .onConflict(['walletAddress', 'authKey'])
        .ignore()
        .transacting(trx);
    });

    const wallet = await this.dbService
      .db<{ label: string; address: number[] }>('wallets')
      .where('address', addressLit)
      .first();

    return {
      label: wallet!.label,
      address: new Uint8Array(wallet!.address),
    };
  }

  public async saveWalletAuthKey(
    address: Uint8Array,
    authKey: Uint8Array,
  ): Promise<void> {
    await this.dbService
      .db('walletsAuthKeys')
      .insert({
        address: this.dbService.raw(address),
        authKey: this.dbService.raw(authKey),
      })
      .onConflict(['address', 'authKey'])
      .ignore();
  }

  public async getWallets(): Promise<Wallet[]> {
    const rows = await this.dbService.db!('wallets').select('*');
    return rows.map((row) => this.walletMapper(row));
  }

  public async getWallet(id: Uint8Array): Promise<Wallet | null> {
    const row = await this.dbService
      .db('wallets')
      .where('address', this.dbService.raw(id))
      .first();

    if (!row) {
      return null;
    }
    return this.walletMapper(row);
  }

  private walletMapper(entity: { label: string; address: Uint8Array }): Wallet {
    return {
      label: entity.label,
      address: entity.address,
    };
  }
}

export default WalletRepository;
