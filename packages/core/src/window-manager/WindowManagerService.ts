import { Inject, Injectable, OnModuleInit } from "@nestjs/common";

import { IWindow , IWindowManagerSerivce } from "./interfaces";
import { WindowType } from "./types";
import { PlatformTypes } from "../platform/platform-types";
import { PlatformWindowManagerService } from "../platform/interfaces";

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
