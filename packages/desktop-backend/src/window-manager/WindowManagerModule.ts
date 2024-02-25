import { Module, Scope, forwardRef } from "@nestjs/common";
import { WindowManagerService } from "./WindowManagerService";
import { Types } from "../types";
import WalletsModule from "../wallets/WalletsModule";
import { GraphQLModule } from "../graphql/graphql.module";
import Window from "./Window";
import WindowFactory from "./WindowFactory";
import WindowResolver from "./WindowResolver";

@Module({
  imports: [GraphQLModule, forwardRef(() => WalletsModule), WindowResolver],
  providers: [
    {
      provide: Types.IWindow,
      useClass: Window,
      scope: Scope.TRANSIENT,
    },
    {
      provide: Types.IWindowFactory,
      useClass: WindowFactory,
    },
    {
      provide: Types.IWindowManagerService,
      useClass: WindowManagerService,
    },
  ],
  exports: [Types.IWindowManagerService],
})
export class WindowManagerModule {}
