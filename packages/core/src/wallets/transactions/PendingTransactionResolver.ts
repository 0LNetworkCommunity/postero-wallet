import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Repeater } from '@repeaterjs/repeater';
import { Inject } from '@nestjs/common';
import PendingTransaction from './PendingTransaction';
import { Types } from '../../types';
import {
  IPendingTransactionsService,
  IPendingTransactionsUpdaterService,
  ITransactionsRepository,
  PendingTransactionsServiceEvent,
} from './interfaces';
import { AbstractTransaction } from './AbstractTransaction';

@Resolver(PendingTransaction)
class PendingTransactionsResolver {
  public constructor(
    @Inject(Types.IPendingTransactionsService)
    private readonly pendingTransactionsService: IPendingTransactionsService,

    @Inject(Types.ITransactionsRepository)
    private readonly transactionsRepository: ITransactionsRepository,

    @Inject(Types.IPendingTransactionsUpdaterService)
    private readonly pendingTransactionsUpdaterService: IPendingTransactionsUpdaterService,
  ) {}

  @Query((returns) => PendingTransaction)
  public async pendingTransaction(
    @Args('hash', { type: () => Buffer })
    hash: Uint8Array,
  ) {
    const pendingTransaction =
      await this.pendingTransactionsService.getPendingTransaction(hash);
    return pendingTransaction;
  }

  @Query((returns) => [PendingTransaction])
  public pendingTransactions() {
    return this.pendingTransactionsService.getPendingTransactions();
  }

  @Query((returns) => [PendingTransaction])
  public async walletPendingTransactions(
    @Args('address', { type: () => Buffer })
    address: Uint8Array,
  ) {
    return this.pendingTransactionsService.getWalletPendingTransactions(
      address,
    );
  }

  @Mutation((returns) => Boolean)
  public async removePendingTransaction(
    @Args('hash', { type: () => Buffer })
    hash: Uint8Array,
  ) {
    await this.pendingTransactionsService.removePendingTransaction(hash);
    return true;
  }

  @Mutation((returns) => Boolean)
  public async updatePendingTransaction(
    @Args('hash', { type: () => Buffer })
    hash: Uint8Array,
  ) {
    const pendingTransaction =
      await this.pendingTransactionsService.getPendingTransaction(hash);
    if (pendingTransaction) {
      await this.pendingTransactionsUpdaterService.updateTransaction(
        pendingTransaction,
      );
      return true;
    }
    return false;
  }

  @Subscription((returns) => PendingTransaction)
  public newPendingTransaction() {
    return new Repeater(async (push, stop) => {
      const release = this.pendingTransactionsService.on(
        PendingTransactionsServiceEvent.NewPendingTransaction,
        async (pendingTrasaction) => {
          push({
            newPendingTransaction: pendingTrasaction,
          });
        },
      );
      await stop;
      release();
    });
  }

  @Subscription((returns) => Buffer)
  public pendingTransactionRemoved() {
    return new Repeater(async (push, stop) => {
      const release = this.pendingTransactionsService.on(
        PendingTransactionsServiceEvent.PendingTransactionRemoved,
        async (hash) => {
          push({
            pendingTransactionRemoved: hash,
          });
        },
      );
      await stop;
      release();
    });
  }

  @Subscription((returns) => PendingTransaction, { name: 'pendingTransaction' })
  public pendingTransactionSubscription(
    @Args({ name: 'hash', type: () => Buffer })
    hash: Uint8Array,
  ) {
    return new Repeater(async (push, stop) => {
      const release = this.pendingTransactionsService.on(
        PendingTransactionsServiceEvent.PendingTransactionUpdated,
        async (pendingTransaction) => {
          if (Buffer.from(pendingTransaction.hash).equals(Buffer.from(hash))) {
            push({
              pendingTransaction:
                await this.pendingTransactionsService.getPendingTransaction(
                  pendingTransaction.hash,
                ),
            });
          }
        },
      );

      await stop;
      release();
    });
  }

  @ResolveField(() => AbstractTransaction, { nullable: true })
  public async transaction(@Parent() pendingTransaction: PendingTransaction) {
    return this.transactionsRepository.getTransactionByHash(
      pendingTransaction.hash,
    );
  }

  @ResolveField(() => Boolean)
  public async updating(@Parent() pendingTransaction: PendingTransaction) {
    return this.pendingTransactionsUpdaterService.transactionUpdating(
      pendingTransaction,
    );
  }
}

export default PendingTransactionsResolver;
