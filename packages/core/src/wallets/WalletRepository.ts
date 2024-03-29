import { Inject, Injectable } from "@nestjs/common";
import { IWalletRepository } from "./interfaces";
import { Types } from "../types";
import { IDbService } from "../db/interfaces";
import { CryptoWallet } from "../crypto/interfaces";
import { PlatformTypes } from "../platform/platform-types";
import Wallet from "../crypto/Wallet";
import { PlatformEncryptedStoreService, PlatformCryptoService, EncryptedStoreRule } from "../platform/interfaces";

@Injectable()
class WalletRepository implements IWalletRepository {
  deleteWallet(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  setWalletLabel(walletId: string, label: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getWalletPrivateKey(id: string): Promise<Uint8Array> {
    throw new Error("Method not implemented.");
  }

  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(PlatformTypes.CryptoService)
  private readonly platformCryptoService: PlatformCryptoService;

  @Inject(PlatformTypes.EncryptedStoreService)
  private readonly platformEncryptedStoreService: PlatformEncryptedStoreService;

  public async saveWallet(wallet: CryptoWallet): Promise<Wallet> {
    const address = Buffer.from(wallet.accountAddress.address).toString("hex").toUpperCase();
    const privateKey = Buffer.from(wallet.privateKey).toString("hex").toUpperCase();

    await this.platformEncryptedStoreService.setItem(
      address,
      privateKey,
      EncryptedStoreRule.WhenUnlockedThisDeviceOnly,
    );

    const [{ total }] = await this.dbService
      .db("wallets")
      .count("*", { as: "total" });

    // const query = this.dbService
    //   .db("wallets")
    //   .insert({
    //     id: this.platformCryptoService.randomUUID(),
    //     label: `Wallet #${(total as number) + 1}`,
    //     publicKey: Buffer.from(wallet.publicKey),
    //     authenticationKey: Buffer.from(wallet.authenticationKey.bytes),
    //     address: Buffer.from(wallet.accountAddress.address),
    //   })
    //   .returning("*")
    //   .toSQL();

    const rows = await this.dbService.db.raw(`
      insert into wallets (
        address,
        authenticationKey,
        id,
        label,
        publicKey
      ) values
        (
          X'${Buffer.from(wallet.accountAddress.address).toString("hex")}',
          X'${Buffer.from(wallet.authenticationKey.bytes).toString("hex")}',
          '${this.platformCryptoService.randomUUID()}',
          'Wallet #${(total as number) + 1}',
          X'${Buffer.from(wallet.publicKey).toString("hex")}'
        )
      returning *
    `);

    return this.walletMapper(rows[0]);
  }

  public async getWallets(): Promise<Wallet[]> {
    const rows = await this.dbService.db!("wallets").select("*");
    return rows.map((row) => this.walletMapper(row));
  }

  public async getWallet(id: string): Promise<Wallet | null> {
    const row = await this.dbService
      .db("wallets")
      .where("id", id)
      .first();

    if (!row) {
      return null;
    }
    return this.walletMapper(row);
  }

  private walletMapper(entity: {
    id: string;
    label: string;
    publicKey: Buffer;
    authenticationKey: Buffer;
    address: Buffer;
  }): Wallet {
    return {
      id: entity.id,
      label: entity.label,
      publicKey: entity.publicKey,
      authenticationKey: entity.authenticationKey,
      accountAddress: entity.address,
    };
  }

}

export default WalletRepository;
