import { Module } from '@nestjs/common';

import { Types } from '../types';
import KeychainResolver from './KeychainResolver';
import KeychainService from './KeychainService';
import KeychainRepository from './KeychainRepository';
import DbModule from '../db/DbModule';

@Module({
  imports: [DbModule],

  providers: [
    KeychainResolver,

    {
      provide: Types.IKeychainService,
      useClass: KeychainService,
    },
    {
      provide: Types.IKeychainRepository,
      useClass: KeychainRepository,
    },
  ],

  exports: [Types.IKeychainService],
})
class KeychainModule {}

export default KeychainModule;
