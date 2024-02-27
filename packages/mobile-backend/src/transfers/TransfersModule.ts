import { Module } from "@nestjs/common";
import TransfersResolver from "./TransfersResolver";
import WalletsModule from "../wallets/WalletsModule";

@Module({
  imports: [WalletsModule],
  providers: [TransfersResolver],
  exports: [],
})
class TransfersModule {}

export default TransfersModule;
