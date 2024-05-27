// import { shell } from "electron";
import {
  Args,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from "@nestjs/graphql";
import { Repeater } from "@repeaterjs/repeater";
import { Inject } from "@nestjs/common";
import PendingTransaction from "./PendingTransaction";
import { Types } from "../types";
import {
  IPendingTransactionsService,
  PendingTransactionsServiceEvent,
} from "./interfaces";

@Resolver((of) => PendingTransaction)
class PendingTransactionsResolver {
  @Inject(Types.IPendingTransactionsService)
  private readonly pendingTransactionsService: IPendingTransactionsService;

  @Query((returns) => PendingTransaction)
  public async pendingTransaction(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    const pendingTransaction =
      await this.pendingTransactionsService.getPendingTransaction(id);
    return pendingTransaction;
  }

  @Query((returns) => [PendingTransaction])
  public pendingTransactions() {
    return this.pendingTransactionsService.getPendingTransactions();
  }

  @Mutation((returns) => Boolean)
  public async sendPendingTransaction(
    @Args('id', { type: () => String })
    id: string,

    // @Args("walletAddress", { type: () => String })
    // walletAddress: string,

    // @Args("gasPrice", { type: () => Int })
    // gasPrice: number,

    // @Args("maxGasUnit", { type: () => Int })
    // maxGasUnit: number,

    // @Args("timeout", { type: () => Int })
    // timeout: number,
  ) {
    // const transactionHash =
    //   await this.pendingTransactionsService.sendPendingTransaction(
    //     pendingTransactionId,
    //     Buffer.from(walletAddress, 'hex'),
    //     gasPrice,
    //     maxGasUnit,
    //     timeout,
    //   );

    // if (transactionHash) {
    //   console.log(
    //     `https://rpc.0l.fyi/v1/transactions/by_hash/0x${Buffer.from(
    //       transactionHash,
    //     ).toString("hex")}`,
    //   );
    //   // shell.openExternal(
    //   //   `https://rpc.0l.fyi/v1/transactions/by_hash/0x${Buffer.from(
    //   //     transactionHash,
    //   //   ).toString("hex")}`,
    //   // );
    // }
    // return transactionHash;

    console.log('sendPendingTransaction', id);

    return true;
  }

  @Mutation((returns) => Boolean)
  public async removePendingTransaction(
    @Args('pendingTransactionId', { type: () => ID })
    pendingTransactionId: string,
  ) {
    await this.pendingTransactionsService.removePendingTransaction(
      pendingTransactionId,
    );
    return true;
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

  @Subscription((returns) => String)
  public pendingTransactionRemoved() {
    return new Repeater(async (push, stop) => {
      const release = this.pendingTransactionsService.on(
        PendingTransactionsServiceEvent.PendingTransactionRemoved,
        async (pendingTrasactionId) => {
          push({
            pendingTransactionRemoved: pendingTrasactionId,
          });
        },
      );
      await stop;
      release();
    });
  }

  @Subscription((returns) => PendingTransaction, { name: 'pendingTransaction' })
  public pendingTransactionSubscription(
    @Args({ name: "id", type: () => ID })
    id: string,
  ) {
    return new Repeater(async (push, stop) => {
      const release = this.pendingTransactionsService.on(
        PendingTransactionsServiceEvent.PendingTransactionUpdated,
        (pendingTransaction) => {
          if (pendingTransaction.id === id) {
            push({
              pendingTransaction,
            });
          }
        },
      );

      await stop;
      release();
    });
  }
}

export default PendingTransactionsResolver;
