import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';

import { IBalance, IGraphQLWallet, IWalletService } from './interfaces';
import { Types } from '../types';

@ObjectType("Wallet")
class GraphQLWallet implements IGraphQLWallet {
  @Field((type) => ID)
  public id: string;

  @Field()
  public label: string;

  @Field()
  public publicKey: Buffer;

  @Field()
  public authenticationKey: Buffer;

  @Field()
  public accountAddress: Buffer;

  @Inject(Types.IWalletService)
  private readonly walletSerivce: IWalletService;

  public init(
    id: string,
    label: string,
    publicKey: Buffer,
    authenticationKey: Buffer,
    accountAddress: Buffer,
  ) {
    this.id = id;
    this.label = label;
    this.publicKey = publicKey;
    this.authenticationKey = authenticationKey;
    this.accountAddress = accountAddress;
  }

  public async balances(): Promise<IBalance[]> {
    return this.walletSerivce.getWalletBalances(this.id);
  }
}

export default GraphQLWallet;
