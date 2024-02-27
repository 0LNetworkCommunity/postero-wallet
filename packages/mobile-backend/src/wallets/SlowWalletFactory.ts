import { ModuleRef } from "@nestjs/core";
import { Inject, Injectable } from "@nestjs/common";

import { ISlowWallet, ISlowWalletFactory } from "./interfaces";
import { Types } from "../types";

@Injectable()
class SlowWalletFactory implements ISlowWalletFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async getSlowWallet(
    transferred: string,
    unlocked: string,
  ): Promise<ISlowWallet> {
    const slowWallet = await this.moduleRef.resolve<ISlowWallet>(
      Types.ISlowWallet,
    );
    slowWallet.init(transferred, unlocked);
    return slowWallet;
  }
}

export default SlowWalletFactory;
