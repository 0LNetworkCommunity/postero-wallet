import { Module } from "@nestjs/common";

import { WindowManagerModule } from "../window-manager/WindowManagerModule";
import DAppsModule from "../dapps/DAppsModule";
import WalletsModule from "../wallets/WalletsModule";
import IpcModule from "../ipc/ipc.module";
import { GraphQLModule } from "../graphql/graphql.module";
import RpcModule from "../rpc/RpcModule";
import { AppService } from "./app.service";
import SettingsModule from "../settings/SettingsModule";
import TransactionsModule from "../transactions/TransactionsModule";

@Module({
  imports: [
    GraphQLModule,

    DAppsModule,
    WalletsModule,
    IpcModule,
    RpcModule,
    SettingsModule,
    TransactionsModule,
    WindowManagerModule,
  ],
  providers: [AppService],
})
export class AppModule {}
