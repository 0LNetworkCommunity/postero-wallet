import { Inject, Injectable } from '@nestjs/common';
import Emittery, { UnsubscribeFn } from "emittery";
import { Repeater } from '@repeaterjs/repeater';

import { IWalletWatcher, WalletWatcherEvent } from './interfaces';
import { Types } from '../types';
import { IOlFyiService } from '../ol-fyi/interfaces';

@Injectable()
export class WalletWatcher implements IWalletWatcher {
  public address: Uint8Array;

  private destroyPromise: Promise<void>;

  private resolveDestroyPromise: () => void;

  private readonly eventEmitter = new Emittery();

  public constructor(
    @Inject(Types.IOlFyiService)
    private readonly olFyiService: IOlFyiService,
  ) {
    this.destroyPromise = new Promise<void>((resolve) => {
      this.resolveDestroyPromise = resolve;
    });
  }

  public init(address: Uint8Array): void {
    this.address = address;

    setTimeout(() => {
      this.initWatcher().catch((error) => {
        console.error('unable to init wallet watcher', error);
      });
    }, 1_000);
  }

  public async destroy(): Promise<void> {
    this.resolveDestroyPromise();
  }

  public on(
    event: WalletWatcherEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(event, listener);
  }

  private async initWatcher() {
    const walletTransactionSubscription = this.olFyiService.wsGraphql.iterate<{
      walletTransaction: { hash: string; status: string };
    }>({
      query: `
        subscription WalletTransaction($address: Bytes!){
          walletTransaction(address: $address) {
            hash
            status
          }
        }
      `,
      variables: {
        address: Buffer.from(this.address).toString('hex'),
      },
    });

    for await (const value of Repeater.race([
      walletTransactionSubscription,
      this.destroyPromise,
    ])) {

      if (!value) {
        return;
      }

      if (value.data) {
        this.eventEmitter.emit(WalletWatcherEvent.PendingTransaction, {
          hash: new Uint8Array(
            Buffer.from(value.data.walletTransaction.hash, 'hex'),
          ),
          status: value.data.walletTransaction.status,
        });
      }
    }
  }
}
