import { Module } from '@nestjs/common';
import TransfersResolver from './TransfersResolver';
import WalletsModule from '../wallets/WalletsModule';
import TransactionsModule from '../transactions/TransactionsModule';

@Module({
  imports: [WalletsModule, TransactionsModule],
  providers: [TransfersResolver],
  exports: [],
})
class TransfersModule {}

export default TransfersModule;
