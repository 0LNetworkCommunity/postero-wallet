import { ModuleRef } from "@nestjs/core";
import { Inject, Injectable } from "@nestjs/common";

import { IWalletKey, IWalletKeyFactory } from "./interfaces";
import { Types } from "../../types";
import WalletKey from "./WalletKey";

@Injectable()
class WalletKeyFactory implements IWalletKeyFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async createWalletKey(
    publicKey: Uint8Array,
    authKey: Uint8Array,
  ): Promise<IWalletKey> {
    const walletKey = await this.moduleRef.resolve<WalletKey>(Types.IWalletKey);
    walletKey.init(publicKey, authKey);
    return walletKey;
  }
}

export default WalletKeyFactory;
