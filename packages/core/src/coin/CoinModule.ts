import { Module, Scope } from "@nestjs/common";

import { Types } from "../types";
import CoinRepository from "./CoinRepository";
import DbModule from "../db/DbModule";
import OpenLibraModule from "../open-libra/OpenLibraModule";
import Coin from "./Coin";
import CoinFactory from "./CoinFactory";

@Module({
  imports: [
    DbModule, OpenLibraModule
  ],
  providers: [
    {
      provide: Types.ICoinRepository,
      useClass: CoinRepository,
    },
    {
      provide: Types.ICoinFactory,
      useClass: CoinFactory,
    },
    {
      provide: Types.ICoin,
      useClass: Coin,
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [Types.ICoinRepository, Types.ICoinFactory],
})
class CoinModule {}

export default CoinModule;
