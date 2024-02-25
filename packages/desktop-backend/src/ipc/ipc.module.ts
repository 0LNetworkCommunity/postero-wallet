import { Module } from "@nestjs/common";
import { IpcService } from "./ipc.service";
import { WindowManagerModule } from "../window-manager/WindowManagerModule";

@Module({
  imports: [WindowManagerModule],
  providers: [IpcService],
  exports: [IpcService],
})
class IpcModule {}

export default IpcModule;
