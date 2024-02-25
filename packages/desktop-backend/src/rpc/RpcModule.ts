import { Module, Scope } from "@nestjs/common";

import { Types } from "../types";
import RpcService from "./RpcService";
import BrowserTabService from "./BrowserTabService";
import BrowserTabFactory from "./BrowserTabFactory";
import BrowserTab from "./BrowserTab";
import BrowserBridge from "./BrowserBridge";
import BrowserBridgeFactory from "./BrowserBridgeFactory";
import DAppsModule from "../dapps/DAppsModule";
import TransactionsModule from "../transactions/TransactionsModule";

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

    {
      provide: Types.IBrowserBridgeFactory,
      useClass: BrowserBridgeFactory,
    },
    {
      provide: Types.IBrowserBridge,
      useClass: BrowserBridge,
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [],
})
class RpcModule {}

export default RpcModule;
