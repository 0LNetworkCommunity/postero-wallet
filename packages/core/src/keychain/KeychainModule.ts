import { Module, Scope, forwardRef } from '@nestjs/common';

import { Types } from '../types';
import KeychainResolver from './KeychainResolver';
import KeychainService from './KeychainService';
import KeychainRepository from './KeychainRepository';
import DbModule from '../db/DbModule';
import WalletKeyFactory from './WalletKeyFactory';
import WalletKey from './WalletKey';
import WalletKeyResolver from './WalletKeyResolver';
import WalletsModule from '../wallets/WalletsModule';

@Module({
  imports: [DbModule, forwardRef(() => WalletsModule)],

  providers: [
    KeychainResolver,
    WalletKeyResolver,

    {
      provide: Types.IKeychainService,
      useClass: KeychainService,
    },
    {
      provide: Types.IKeychainRepository,
      useClass: KeychainRepository,
    },
    {
      provide: Types.IWalletKeyFactory,
      useClass: WalletKeyFactory,
    },
    {
      provide: Types.IWalletKey,
      useClass: WalletKey,
      scope: Scope.TRANSIENT,
    },
  ],

  exports: [Types.IKeychainService],
})
class KeychainModule {}

export default KeychainModule;
