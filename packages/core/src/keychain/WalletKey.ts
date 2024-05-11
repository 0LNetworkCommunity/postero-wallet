import { Inject } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { PlatformTypes } from '../platform/platform-types';
import { PlatformEncryptedStoreService } from '../platform/interfaces';
import { IWalletKey } from './interfaces';

@ObjectType('WalletKey')
class WalletKey implements IWalletKey {
  @Inject(PlatformTypes.EncryptedStoreService)
  private readonly platformEncryptedStoreService: PlatformEncryptedStoreService;

  @Field(() => Buffer)
  public publicKey: Uint8Array;

  @Field(() => Buffer)
  public authKey: Uint8Array;

  public init(publicKey: Uint8Array, authKey: Uint8Array) {
    this.publicKey = publicKey;
    this.authKey = authKey;
  }

  public async getPrivateKey(): Promise<Uint8Array> {
    const item = await this.platformEncryptedStoreService.getItem(
      Buffer.from(this.publicKey).toString('hex').toUpperCase(),
    );
    if (!item) {
      throw new Error('Private key not found');
    }
    return new Uint8Array(Buffer.from(item, 'hex'));
  }
}

export default WalletKey;
