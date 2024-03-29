import { Module} from "@nestjs/common";
import { WindowManagerService } from "./WindowManagerService";
import { Types } from "../types";
import WindowResolver from "./WindowResolver";

@Module({
  providers: [
    WindowResolver,
    {
      provide: Types.IWindowManagerService,
      useClass: WindowManagerService,
    },
  ],
  exports: [Types.IWindowManagerService],
})
export class WindowManagerModule {}
