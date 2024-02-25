import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ipcMain, IpcMainInvokeEvent } from "electron";

import { IpcMethod } from "./methods";
import { Types } from '../types';
import { IWindowManagerSerivce } from '../window-manager/interfaces';

@Injectable()
export class IpcService implements OnModuleInit {
  @Inject(Types.IWindowManagerService)
  private readonly windowManagerService: IWindowManagerSerivce;

  public async onModuleInit() {
    for (const methodName of Object.values(IpcMethod)) {
      ipcMain.handle(methodName, (event, args) =>
        this.handler(methodName, event, args),
      );
    }
  }

  private handler(method: IpcMethod, event: IpcMainInvokeEvent, args: any) {
    const window = this.windowManagerService.getWindowFromWebContents(event.sender);
    if (window) {
      return window.handleIpcCall(method, event, args);
    }
  }
}
