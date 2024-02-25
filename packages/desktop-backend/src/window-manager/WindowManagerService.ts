
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

@Injectable()
export class WindowManagerService
  implements OnModuleInit, IWindowManagerSerivce
{
  @Inject(Types.IWalletService)
  private readonly walletService: IWalletService;

  @Inject(Types.IWindowFactory)
  private readonly windowFactory: IWindowFactory;

  // We only allow one instance of the settings window
  private settingsWindow?: IWindow;

  private readonly windows: IWindow[] = [];

  private onNotification = (event: string) => {
    // switch (event) {
    //   case "AppleInterfaceThemeChangedNotification":
    //   case "AppleAquaColorVariantChanged":
    //     setTimeout(() => {
    //       const accentColor = systemPreferences.getAccentColor();
    //       this.mainWindow?.window?.webContents.send(
    //         "accent-color-change",
    //         `#${accentColor}`,
    //       );
    //     }, 0);
    //     break;
    //   case "AppleColorPreferencesChangedNotification":
    //     break;
    //   case "AppleShowScrollBarsSettingChanged":
    //     break;
    // }
  };

  public onModuleInit() {
    // const macOsEvents = [
    //   "AppleInterfaceThemeChangedNotification",
    //   "AppleAquaColorVariantChanged",
    //   "AppleColorPreferencesChangedNotification",
    //   "AppleShowScrollBarsSettingChanged",
    // ];

    // for (const eventName of macOsEvents) {
    //   systemPreferences.subscribeNotification(eventName, this.onNotification);
    // }

    this.createMenu();

    ipcMain.on("context-menu", (event, data: unknown) => {
      const window = this.getWindowFromWebContents(event.sender);
      if (window) {
        const contextMenuData = data as ContextMenuEventData;
        window.onContextMenu(contextMenuData);
      }
    });
  }

  /**
   * When an IPC call is triggered from a window, the event contains the
   * `WebContents` object. This method helps retreie the associated IWindow.
   * @param webContents
   */
  public getWindowFromWebContents(
    webContents: WebContents,
  ): IWindow | undefined {
    const browserWindow = BrowserWindow.fromWebContents(webContents);
    if (browserWindow) {
      const window = this.windows.find((it) => it.window === browserWindow);
      return window;
    }
  }

  private getColors() {
    const macOsColors = [
      "control-background",
      "control",
      "control-text",
      "disabled-control-text",
      "find-highlight",
      "grid",
      "header-text",
      "highlight",
      "keyboard-focus-indicator",
      "label",
      "link",
      "placeholder-text",
      "quaternary-label",
      "scrubber-textured-background",
      "secondary-label",
      "selected-content-background",
      "selected-control",
      "selected-control-text",
      "selected-menu-item-text",
      "selected-text-background",
      "selected-text",
      "separator",
      "shadow",
      "tertiary-label",
      "text-background",
      "text",
      "under-page-background",
      "unemphasized-selected-content-background",
      "unemphasized-selected-text-background",
      "unemphasized-selected-text",
      "window-background",
      "window-frame-text",
    ];

    for (const color of macOsColors) {
      const value = systemPreferences.getColor(color as any);
      console.log(color, value);
    }
  }

  public async createWindow(
    type: WindowType,
    params?: any,
    parent?: IWindow,
  ): Promise<IWindow> {
    // this.getColors();

    if (type === WindowType.Settings && this.settingsWindow) {
      this.settingsWindow.window?.moveTop();
      return this.settingsWindow;
    }

    await app.whenReady();

    const window = await this.windowFactory.createWindow(type, params, parent);

    this.windows.push(window);

    if (type == WindowType.Settings) {
      this.settingsWindow = window;
      window.on(WindowEvent.Close, () => (this.settingsWindow = undefined));
    }

    window.on(WindowEvent.Close, () => {
      const index = this.windows.indexOf(window);
      if (index !== -1) {
        this.windows.splice(index, 1);
      }
    });

    return window;
  }

  private createMenu() {
    const isMac = process.platform === "darwin";

    const template = [
      // { role: 'appMenu' }
      ...(isMac
        ? [
            {
              label: app.name,
              submenu: [
                { role: "about" },
                { type: "separator" },
                {
                  label: "Settings...",
                  accelerator:
                    process.platform === "darwin" ? "Cmd+," : "Ctrl+N",
                  click: async () => {
                    await this.createWindow(WindowType.Settings);
                  },
                },
                { role: "services" },
                { type: "separator" },
                { role: "hide" },
                { role: "hideOthers" },
                { role: "unhide" },
                { type: "separator" },
                { role: "quit" },
              ],
            },
          ]
        : []),
      // { role: 'fileMenu' }
      {
        label: "File",
        submenu: [
          {
            label: "New Window",
            accelerator: process.platform === "darwin" ? "Cmd+N" : "Ctrl+N",
            click: async () => {
              await this.createWindow(WindowType.Main);
            },
          },
          isMac ? { role: "close" } : { role: "quit" },
        ],
      },
      // { role: 'editMenu' }
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
          ...(isMac
            ? [
                { role: "pasteAndMatchStyle" },
                { role: "delete" },
                { role: "selectAll" },
                { type: "separator" },
                {
                  label: "Speech",
                  submenu: [
                    { role: "startSpeaking" },
                    { role: "stopSpeaking" },
                  ],
                },
              ]
            : [
                { role: "delete" },
                { type: "separator" },
                { role: "selectAll" },
              ]),
        ],
      },
      // { role: 'viewMenu' }
      {
        label: "View",
        submenu: [
          { role: "reload" },
          { role: "forceReload" },
          { role: "toggleDevTools" },
          { type: "separator" },
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
          { type: "separator" },
          { role: "togglefullscreen" },
        ],
      },
      // { role: 'windowMenu' }
      {
        label: "Window",
        submenu: [
          { role: "minimize" },
          { role: "zoom" },
          ...(isMac
            ? [
                { type: "separator" },
                { role: "front" },
                { type: "separator" },
                { role: "window" },
              ]
            : [{ role: "close" }]),
        ],
      },
      {
        role: "help",
        submenu: [
          {
            label: "Learn More",
            click: async () => {
              await shell.openExternal("https://postero.app");
            },
          },
        ],
      },
      {
        label: "Wallet",
        submenu: [
          {
            label: "New Wallet",
            click: async () => {
              await this.walletService.newWallet();
            },
          },
          {
            label: "Import Wallet",
            click: async () => {
              await this.createWindow(WindowType.ImportWallet);
            },
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template as any);
    Menu.setApplicationMenu(menu);
  }
}
