import { ModuleRef } from '@nestjs/core';
import { Inject, Injectable } from '@nestjs/common';

import { IGraphQLWallet, IGraphQLWalletFactory } from './interfaces';
import { Types } from '../types';

@Injectable()
class GraphQLWalletFactory implements IGraphQLWalletFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async getGraphQLWallet(
    label: string,
    address: Uint8Array,
  ): Promise<IGraphQLWallet> {
    const wallet = await this.moduleRef.resolve<IGraphQLWallet>(
      Types.IGraphQLWallet,
    );
    wallet.init(label, address);
    return wallet;
  }
}

export default GraphQLWalletFactory;
