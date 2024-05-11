import { Module } from '@nestjs/common';

import { Types } from '../types';
import KeyRotationResolver from './KeyRotationResolver';
import KeyRotationService from './KeyRotationService';
import DbModule from '../db/DbModule';
import KeychainModule from '../keychain/KeychainModule';
import OpenLibraModule from '../open-libra/OpenLibraModule';

@Module({
  imports: [DbModule, KeychainModule, OpenLibraModule],

  providers: [
    KeyRotationResolver,
    {
      provide: Types.IKeyRotationService,
      useClass: KeyRotationService,
    },
  ],

  exports: [Types.IKeyRotationService],
})
class KeyRotationModule {}

export default KeyRotationModule;
