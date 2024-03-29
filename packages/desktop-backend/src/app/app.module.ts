import { Module } from "@nestjs/common";

import { WindowManagerModule } from "../window-manager/WindowManagerModule";
import DAppsModule from "../dapps/DAppsModule";
import WalletsModule from "../wallets/WalletsModule";
import { GraphQLModule } from "../graphql/graphql.module";
import RpcModule from "../rpc/RpcModule";
import { AppService } from "./app.service";
import SettingsModule from "../settings/SettingsModule";
import TransactionsModule from "../transactions/TransactionsModule";
import { PlatformModule } from "../platform/PlatformModule";
import ElectronPlatformModule from "../platform/ElectronPlatformModule";

@Module({
  imports: [
    PlatformModule.forRoot(ElectronPlatformModule),

    GraphQLModule,

    DAppsModule,
    WalletsModule,
    RpcModule,
    SettingsModule,
    TransactionsModule,
    WindowManagerModule,
  ],
  providers: [AppService],
})
export class AppModule {}
