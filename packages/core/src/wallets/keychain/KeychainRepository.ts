import { Inject, Injectable } from '@nestjs/common';

import {
  IKeychainRepository,
  IWalletKey,
  IWalletKeyFactory,
} from './interfaces';
import { IDbService } from '../../db/interfaces';
import { Types } from '../../types';

@Injectable()
class KeychainRepository implements IKeychainRepository {
  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(Types.IWalletKeyFactory)
  private readonly walletKeyFactory: IWalletKeyFactory;

  public async saveKey(
    publicKey: Uint8Array,
    authKey: Uint8Array,
  ): Promise<void> {
    await this.dbService
      .db('keys')
      .insert({
        publicKey: this.dbService.raw(publicKey),
        authKey: this.dbService.raw(authKey),
      })
      .onConflict('publicKey')
      .ignore();
  }

  public async getWalletKey(publicKey: Uint8Array): Promise<IWalletKey> {
    const item = await this.dbService
      .db<{
        authKey: Uint8Array;
        publicKey: Uint8Array;
      }>('keys')
      .where('publicKey', this.dbService.raw(publicKey))
      .first();
    if (!item) {
      throw new Error('Wallet key not found');
    }
    return this.walletKeyFactory.createWalletKey(item.publicKey, item.authKey);
  }

  public async getWalletKeyFromAuthKey(
    authKey: Uint8Array,
  ): Promise<IWalletKey> {
    const item = await this.dbService
      .db<{
        authKey: Uint8Array;
        publicKey: Uint8Array;
      }>('keys')
      .where('authKey', this.dbService.raw(authKey))
      .first();
    if (!item) {
      throw new Error('Wallet key not found');
    }
    return this.walletKeyFactory.createWalletKey(item.publicKey, item.authKey);
  }

  public async getWalletKeys(): Promise<IWalletKey[]> {
    const items = await this.dbService.db<{
      authKey: Uint8Array;
      publicKey: Uint8Array;
    }>('keys');
    return Promise.all(
      items.map(({ authKey, publicKey }) =>
        this.walletKeyFactory.createWalletKey(publicKey, authKey),
      ),
    );
  }

  public async getWalletWalletKeys(address: Uint8Array): Promise<IWalletKey[]> {
    const items = await this.dbService
      .db('walletsAuthKeys')
      .select('keys.*')
      .leftJoin('keys', 'keys.authKey', 'walletsAuthKeys.authKey')
      .where('walletAddress', this.dbService.raw(address));

    return Promise.all(
      items.map(({ authKey, publicKey }) =>
        this.walletKeyFactory.createWalletKey(publicKey, authKey),
      ),
    );
  }

  public async getWalletKeyFromAddress(
    address: Uint8Array,
  ): Promise<IWalletKey> {
    const item:
      | {
          publicKey: Uint8Array;
          authKey: Uint8Array;
        }
      | undefined = await this.dbService
      .db('wallets')
      .select(['keys.publicKey', 'keys.authKey'])
      .innerJoin('keys', 'keys.authKey', 'wallets.authKey')
      .where('address', this.dbService.raw(address))
      .first();
    if (!item) {
      throw new Error('wallet key not found');
    }

    return this.walletKeyFactory.createWalletKey(item.publicKey, item.authKey);
  }
}

export default KeychainRepository;
