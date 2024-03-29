import { Module, Scope } from "@nestjs/common";

import RpcService from "./RpcService";
import BrowserTabService from "./BrowserTabService";
import BrowserTabFactory from "./BrowserTabFactory";
import BrowserTab from "./BrowserTab";
import TransactionsModule from "../transactions/TransactionsModule";
import { Types } from "../types";
import DAppsModule from "../dapps/DAppsModule";

@Module({
  imports: [DAppsModule, TransactionsModule],
  providers: [
    {
      provide: Types.IRpcService,
      useClass: RpcService,
    },

    {
      provide: Types.IBrowserTabService,
      useClass: BrowserTabService,
    },
    {
      provide: Types.IBrowserTabFactory,
      useClass: BrowserTabFactory,
    },
    {
      provide: Types.IBrowserTab,
      useClass: BrowserTab,
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [Types.IBrowserTabFactory, Types.IBrowserTabService],
})
class RpcModule {}

export default RpcModule;
