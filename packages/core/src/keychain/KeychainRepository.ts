import { Inject, Injectable } from '@nestjs/common';

import { IKeychainRepository } from './interfaces';
import { Types } from '../types';
import { IDbService } from '../db/interfaces';

@Injectable()
class KeychainRepository implements IKeychainRepository {
  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

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
}

export default KeychainRepository;
