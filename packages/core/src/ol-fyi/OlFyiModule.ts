import { Module } from '@nestjs/common';

import { Types } from '../types';
import { OlFyiService } from './OlFyiService';

@Module({
  imports: [],
  providers: [
    {
      provide: Types.IOlFyiService,
      useClass: OlFyiService,
    },
  ],
  exports: [Types.IOlFyiService],
})
export class OlFyiModule {}
