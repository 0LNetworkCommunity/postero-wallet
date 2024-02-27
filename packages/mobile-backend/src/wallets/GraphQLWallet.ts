import { Field, ID, ObjectType } from "@nestjs/graphql";

import { IBalance, IGraphQLWallet, ISlowWallet, IWalletService } from "./interfaces";
import { Inject } from "@nestjs/common";
import { Types } from "../types";

@ObjectType("Wallet")
export class GraphQLWallet implements IGraphQLWallet {
  @Field((type) => ID)
  public id!: string;

  @Field(() => String)
  public label!: string;

  @Field()
  public publicKey: Buffer;

  @Field()
  public authenticationKey: Buffer;

  @Field()
  public accountAddress: Buffer;

  @Inject(Types.IWalletService)
  private readonly walletService: IWalletService;

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
    return this.walletService.getWalletBalances(this.id);
  }

  public async slowWallet(): Promise<ISlowWallet | undefined> {
    return this.walletService.getSlowWallet(this.id);
  }
}
