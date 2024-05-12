import { Field, ObjectType } from "@nestjs/graphql";

import {
  IBalance,
  IGraphQLWallet,
  ISlowWallet,
  IWalletService,
} from './interfaces';
import { Inject } from "@nestjs/common";
import { Types } from "../types";
import { IKeychainService, IWalletKey } from "../keychain/interfaces";

@ObjectType('Wallet')
export class GraphQLWallet implements IGraphQLWallet {
  @Field(() => String)
  public label!: string;

  @Field(() => Buffer)
  public address: Uint8Array;

  @Inject(Types.IWalletService)
  private readonly walletService: IWalletService;

  @Inject(Types.IKeychainService)
  private readonly keychainService: IKeychainService;

  public init(
    label: string,
    address: Uint8Array,
  ) {
    this.label = label;
    this.address = address;
  }

  public async balances(): Promise<IBalance[]> {
    return this.walletService.getWalletBalances(this.address);
  }

  public async slowWallet(): Promise<ISlowWallet | undefined> {
    return this.walletService.getSlowWallet(this.address);
  }

  public async keys(): Promise<IWalletKey[]> {
    return this.keychainService.getWalletWalletKeys(this.address);
  }
}
