import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BCS, TxnBuilderTypes } from 'aptos';
import BN from 'bn.js';

import { Types } from '../../types';
import { IWalletRepository } from '../../wallets/interfaces';
import { IPendingTransactionsService } from '../../wallets/transactions/interfaces';

const {
  EntryFunction,
  TransactionPayloadEntryFunction,
  ModuleId,
  Identifier,
} = TxnBuilderTypes;

@Resolver()
class TransfersResolver {
  @Inject(Types.IWalletRepository)
  private readonly walletRepository: IWalletRepository;

  @Inject(Types.IPendingTransactionsService)
  private readonly pendingTransactionsService: IPendingTransactionsService;

  @Mutation(() => Buffer)
  public async newTransfer(
    @Args('walletAddress', { type: () => Buffer })
    walletAddress: Uint8Array,

    @Args('recipient', { type: () => Buffer })
    recipient: Uint8Array,

    @Args('amount', { type: () => BN })
    amount: BN,
  ) {
    const wallet = await this.walletRepository.getWallet(walletAddress);
    if (!wallet) {
      return false;
    }

    let recipient32: Uint8Array;
    if (recipient.length === 16) {
      recipient32 = new Uint8Array(
        Buffer.concat([Buffer.alloc(16), recipient]),
      );
    } else if (recipient.length === 32) {
      recipient32 = recipient;
    } else {
      throw new Error(`invalid address length ${recipient.length}`);
    }

    const func = new EntryFunction(
      ModuleId.fromStr('0x1::ol_account'),
      new Identifier('transfer'),
      [],
      [recipient32, BCS.bcsSerializeUint64(BigInt(amount.toString(10)))],
    );

    const entryFunctionPayload = new TransactionPayloadEntryFunction(func);

    const maxGasUnit = BigInt(2_000_000);
    const gasPrice = BigInt(200);

    const timeout = 60 * 1; // 1 minute
    const expirationTimestamp = BigInt(
      Math.floor(Date.now() / 1_000) + timeout,
    );

    const serializer = new BCS.Serializer();
    entryFunctionPayload.serialize(serializer);
    const b = serializer.getBytes();

    const hash = await this.pendingTransactionsService.newPendingTransaction(
      walletAddress,
      b,
      maxGasUnit,
      gasPrice,
      expirationTimestamp,
    );

    return hash;
  }
}

export default TransfersResolver;
