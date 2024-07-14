import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import {
  IGraphQLWallet,
  IGraphQLWalletFactory,
  IWalletRepository,
} from './interfaces';
import { Types } from '../types';
import { IDbService } from '../db/interfaces';

class WalletsFromAuthKeysQueue {
  private timeout: NodeJS.Timeout | undefined = undefined;

  private processing: boolean = false;

  private readonly queue = new Map<
    string,
    {
      resolve: (res: Uint8Array[]) => void;
      reject: (error: Error) => void;
      promise: Promise<Uint8Array[]>;
    }
  >();

  public constructor(private readonly dbService: IDbService) {}

  public getWalletsFromAuthKey(authKey: Uint8Array): Promise<Uint8Array[]> {
    const authKeyStr = Buffer.from(authKey).toString('hex');
    const prom = this.queue.get(authKeyStr);
    if (prom) {
      return prom.promise;
    }

    let resolve: ((res: Uint8Array[]) => void) | undefined = undefined;
    let reject: ((error: Error) => void) | undefined = undefined;
    const promise = new Promise<Uint8Array[]>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    this.queue.set(authKeyStr, { promise, resolve: resolve!, reject: reject! });

    this.tick();

    return promise;
  }

  private tick() {
    if (this.queue.size === 0) {
      return;
    }

    if (this.timeout !== undefined) {
      return;
    }

    this.timeout = setTimeout(() => {
      this.timeout = undefined;
      this.requestProcessNextBatch();
    }, 0);
  }

  private requestProcessNextBatch() {
    if (this.processing) {
      console.log('already processing');
      return;
    }
    this.processing = true;

    this.processNextBatch().finally(() => {
      this.processing = false;
      this.tick();
    });
  }

  private async processNextBatch() {
    const keys = Array.from(this.queue.keys()).slice(0, 10);

    if (!keys.length) {
      return;
    }

    try {
      const q = this.dbService
        .db<{
          walletAddress: Uint8Array;
          authKey: Uint8Array;
        }>('walletsAuthKeys')
        .whereIn(
          'authKey',
          keys.map((key) => {
            return this.dbService.db.raw(`X'${key}'`);
          }),
        )
        .toSQL();
      console.log(q.sql);

      const rows = await this.dbService
        .db<{
          walletAddress: Uint8Array;
          authKey: Uint8Array;
        }>('walletsAuthKeys')
        .whereIn(
          'authKey',
          keys.map((key) => {
            return this.dbService.db.raw(`X'${key}'`);
          }),
        );
      const grouped = _.groupBy(rows, (row) =>
        Buffer.from(row.authKey).toString('hex'),
      );

      for (const authKey of Object.keys(grouped)) {
        const el = this.queue.get(authKey);
        if (el) {
          const res = grouped[authKey].map((it) => it.walletAddress);
          this.queue.delete(authKey);
          el.resolve(res);
        }
      }

      for (const key of keys) {
        const el = this.queue.get(key);
        if (el) {
          this.queue.delete(key);
          el.resolve([]);
        }
      }
    } catch (error) {
      for (const key of keys) {
        const el = this.queue.get(key);
        if (el) {
          this.queue.delete(key);
          el.reject(error);
        }
      }
    }
  }
}

@Injectable()
class WalletRepository implements IWalletRepository {
  private readonly walletsFromAuthKeysQueue: WalletsFromAuthKeysQueue;

  public constructor(
    @Inject(Types.IDbService)
    private readonly dbService: IDbService,

    @Inject(Types.IGraphQLWalletFactory)
    private readonly graphQLWalletFactory: IGraphQLWalletFactory,
  ) {
    this.walletsFromAuthKeysQueue = new WalletsFromAuthKeysQueue(dbService);
  }

  public async saveWallet(
    address: Uint8Array,
    authKey: Uint8Array,
  ): Promise<IGraphQLWallet> {
    const [{ total }] = await this.dbService
      .db('wallets')
      .count('*', { as: 'total' });

    const addressLit = this.dbService.raw(address);

    await this.dbService.db.transaction(async (trx) => {
      await this.dbService
        .db('wallets')
        .insert({
          address: addressLit,
          label: `Wallet #${(total as number) + 1}`,
        })
        .onConflict('address')
        .ignore()
        .transacting(trx);

      await this.dbService
        .db('walletsAuthKeys')
        .insert({
          walletAddress: this.dbService.raw(address),
          authKey: this.dbService.raw(authKey),
        })
        .onConflict(['walletAddress', 'authKey'])
        .ignore()
        .transacting(trx);
    });

    const wallet = await this.dbService
      .db<{ label: string; address: number[] }>('wallets')
      .where('address', addressLit)
      .first();

    return this.graphQLWalletFactory.getGraphQLWallet(
      wallet!.label,
      new Uint8Array(wallet!.address),
    );
  }

  public async saveWalletAuthKey(
    address: Uint8Array,
    authKey: Uint8Array,
  ): Promise<void> {
    await this.dbService
      .db('walletsAuthKeys')
      .insert({
        walletAddress: this.dbService.raw(address),
        authKey: this.dbService.raw(authKey),
      })
      .onConflict(['walletAddress', 'authKey'])
      .ignore();
  }

  public async getWallets(): Promise<IGraphQLWallet[]> {
    const rows =
      await this.dbService.db!('wallets').select<
        { label: string; address: Uint8Array }[]
      >('*');
    return Promise.all(
      rows.map((row) =>
        this.graphQLWalletFactory.getGraphQLWallet(row.label, row.address),
      ),
    );
  }

  public async getWallet(address: Uint8Array): Promise<IGraphQLWallet | null> {
    const row = await this.dbService
      .db<{ label: string; address: Uint8Array }>('wallets')
      .where('address', this.dbService.raw(address))
      .first();

    if (!row) {
      return null;
    }
    return this.graphQLWalletFactory.getGraphQLWallet(row.label, row.address);
  }

  public async setWalletLabel(
    address: Uint8Array,
    label: string,
  ): Promise<void> {
    await this.dbService
      .db('wallets')
      .where('address', this.dbService.raw(address))
      .update('label', label);
  }

  public async getWalletsFromAuthKey(
    authKey: Uint8Array,
  ): Promise<IGraphQLWallet[]> {
    const addresses =
      await this.walletsFromAuthKeysQueue.getWalletsFromAuthKey(authKey);

    if (!addresses.length) {
      return [];
    }

    const wallets = await this.dbService
      .db<{
        address: Uint8Array;
        label: string;
      }>('wallets')
      .whereIn(
        'address',
        addresses.map((addr) => this.dbService.raw(addr)),
      );
    return Promise.all(
      wallets.map((wallet) =>
        this.graphQLWalletFactory.getGraphQLWallet(
          wallet.label,
          wallet.address,
        ),
      ),
    );
  }
}

export default WalletRepository;
