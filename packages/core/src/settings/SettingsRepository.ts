import { Inject, Injectable } from '@nestjs/common';

import { Types } from '../types';
import { IDbService } from '../db/interfaces';
import { ISettingsRepository } from './interfaces';
import Settings from './Settings';

@Injectable()
class SettingsRepository implements ISettingsRepository {
  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  public async getSettings(): Promise<Settings> {
    const settings = new Settings();
    settings.init({
      rpcUrl: 'https://rpc.0l.fyi/',
      chainId: 1,
      maxGasUnit: 2_000_000,
      gasPricePerUnit: 200,
    });

    return settings;
  }
}

export default SettingsRepository;
