import { Module, Scope } from "@nestjs/common";

import DAppsResolver from "./DAppsResolver";
import DAppsService from "./DAppsService";
import { Types } from "../types";
import DbModule from "../db/DbModule";
import DAppRepository from "./DAppRepository";
import DAppFactory from "./DAppFactory";
import DAppInstanceFactory from "./DAppInstanceFactory";
import DApp from "./DApp";
import ConnectionRequest from "./ConnectionRequest";
import ConnectionRequestFactory from "./ConnectionRequestFactory";
import ConnectionRequestsResolver from "./ConnectionRequestsResolver";
import WalletsModule from "../wallets/WalletsModule";

@Module({
  imports: [DbModule, WalletsModule, DAppsModule],
  providers: [
    DAppsResolver,
    ConnectionRequestsResolver,

    {
      provide: Types.IDApp,
      useClass: DApp,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Types.IDAppService,
      useClass: DAppsService,
    },
    {
      provide: Types.IDAppRepository,
      useClass: DAppRepository,
    },
    {
      provide: Types.IDAppFactory,
      useClass: DAppFactory,
    },

    {
      provide: Types.IDAppInstanceFactory,
      useClass: DAppInstanceFactory,
    },

    {
      provide: Types.IConnectionRequest,
      useClass: ConnectionRequest,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Types.IConnectionRequestFactory,
      useClass: ConnectionRequestFactory,
    },
  ],

  exports: [Types.IDAppService],
})
class DAppsModule {}

export default DAppsModule;
