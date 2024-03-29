import { ModuleRef } from "@nestjs/core";
import { Inject, Injectable } from "@nestjs/common";

import { IGraphQLWallet, IGraphQLWalletFactory } from "./interfaces";
import { Types } from "../types";

@Injectable()
class GraphQLWalletFactory implements IGraphQLWalletFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async getGraphQLWallet(
    id: string,
    label: string,
    publicKey: Uint8Array,
    authenticationKey: Uint8Array,
    accountAddress: Uint8Array,
  ): Promise<IGraphQLWallet> {
    const wallet = await this.moduleRef.resolve<IGraphQLWallet>(
      Types.IGraphQLWallet,
    );
    wallet.init(
      id,
      label,
      publicKey,
      authenticationKey,
      accountAddress,
    );
    return wallet;
  }
}

export default GraphQLWalletFactory;
