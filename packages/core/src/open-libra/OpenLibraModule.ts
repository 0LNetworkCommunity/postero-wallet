import { Module } from '@nestjs/common';

import { Types } from '../types';
import OpenLibraService from './OpenLibraService';

@Module({
  providers: [
    {
      provide: Types.IOpenLibraService,
      useClass: OpenLibraService,
    },
  ],
  exports: [Types.IOpenLibraService],
})
class OpenLibraModule {}

export default OpenLibraModule;
