import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import {
  shell,
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  systemPreferences,
  WebContents,
} from "electron";

import { IWindow, IWindowFactory, IWindowManagerSerivce } from "./interfaces";
import { Types } from "../types";
import { IWalletService } from "../wallets/interfaces";
import { ContextMenuEventData, WindowEvent, WindowType } from "./types";
import {
  PlatformTypes,
  PlatformWindowManagerService,
} from "@postero/mobile-backend";

@Injectable()
export class WindowManagerService
  implements OnModuleInit, IWindowManagerSerivce
{
  @Inject(PlatformTypes.PlatformWindowManagerService)
  private readonly platformWindowManagerService: PlatformWindowManagerService;

  // @Inject(Types.IWalletService)
  // private readonly walletService: IWalletService;

  // @Inject(Types.IWindowFactory)
  // private readonly windowFactory: IWindowFactory;

  public onModuleInit() {}

  /**
   * When an IPC call is triggered from a window, the event contains the
   * `WebContents` object. This method helps retreie the associated IWindow.
   * @param webContents
   */
  // public getWindowFromWebContents(
  //   webContents: WebContents,
  // ): IWindow | undefined {
  //   return this.platformWindowManagerService.getWindowFromWebContents(
  //     webContents,
  //   );
  // }

  public async createWindow(
    type: WindowType,
    params?: any,
    parent?: IWindow,
  ): Promise<IWindow> {
    return this.platformWindowManagerService.createWindow(type, params, parent);
  }
}
