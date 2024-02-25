import { safeStorage } from "electron";
import { Inject, Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";

import { IWalletRepository } from "./interfaces";
import Wallet from "../crypto/Wallet";
import { IDbService } from "../db/interfaces";
import { Types } from "../types";
import { CryptoWallet } from "../crypto/interfaces";

@Injectable()
class WalletRepository implements IWalletRepository {
  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  public async deleteWallet(id: string) {
    await this.dbService.db("wallets").where("id", id).del();
  }

  public async saveWallet(wallet: CryptoWallet): Promise<Wallet> {
    const privateKey = safeStorage.encryptString(
      Buffer.from(wallet.privateKey).toString("base64"),
    );
    const [{ total }] = await this.dbService
      .db("wallets")
      .count("*", { as: "total" });
 
    const rows = await this.dbService
      .db("wallets")
      .insert({
        id: uuid(),
        label: `Wallet #${(total as number) + 1}`,
        privateKey,
        publicKey: Buffer.from(wallet.publicKey),
        authenticationKey: Buffer.from(wallet.authenticationKey.bytes),
        address: Buffer.from(wallet.accountAddress.address),
      })
      .returning("*");

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

  public async getWalletPrivateKey(id: string): Promise<Uint8Array | null> {
    const row = await this.dbService
      .db<{ privateKey: string }>("wallets")
      .select("privateKey")
      .where("id", id)
      .first();
    if (!row) {
      return null;
    }
    const encryptedPrivateKey = Buffer.from(row.privateKey, "hex");
    const privateKeyBase64 = safeStorage.decryptString(encryptedPrivateKey);
    const privateKey = Buffer.from(privateKeyBase64, "base64");
    return new Uint8Array(privateKey);
  }

  public async setWalletLabel(walletId: string, label: string): Promise<void> {
    await this.dbService
      .db("wallets")
      .update("label", label)
      .where("id", walletId);
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
