import { Inject } from "@nestjs/common";
import path from "node:path";
import {
  app,
  BrowserWindow,
  clipboard,
  dialog,
  IpcMainInvokeEvent,
  Menu,
  PopupOptions,
} from "electron";
import Emittery, { UnsubscribeFn } from "emittery";
import qs from "qs";
import { ObjectType } from "@nestjs/graphql";

import {
  IWindow,
  IWindowManagerSerivce,
  ContextMenu,
  ContextMenuEventData,
  WindowEvent,
  WindowState,
  WindowType,
  AbstractWindow,
  Types,
  IWalletService,
  IGraphQLService,
  IpcMethod,
} from "@postero/mobile-backend";
import { windowsSettings } from "./window-settings";

@ObjectType({
  implements: () => [AbstractWindow],
})
class ElectronWindow implements IWindow {
  public frame: boolean;

  public state: WindowState;

  public window?: BrowserWindow;

  @Inject(Types.IWalletService)
  public walletService: IWalletService;

  @Inject(Types.IWindowManagerService)
  public windowManagerService: IWindowManagerSerivce;

  private readonly eventEmitter = new Emittery();

  @Inject(Types.IGraphQLService)
  private readonly graphQLService: IGraphQLService;

  private ipcHandlers = new Map<IpcMethod, (...args: any[]) => any>([
    [IpcMethod.GraphQLExecute, this.graphqlExecute],
    [IpcMethod.GraphQLSubscribe, this.graphqlSubscribe],
    [IpcMethod.GraphQLUnsubscribe, this.graphqlUnsubscribe],
  ]);

  private readonly contextMenuActions = new Map<
    ContextMenu,
    (event: ContextMenuEventData<unknown>) => void
  >([
    [ContextMenu.ToolbarWalletAction, this.toolbarWalletAction],
    [ContextMenu.WalletAction, this.walletAction],
  ]);

  private onFocus = () => {
    this.state = WindowState.Foreground;
    this.eventEmitter.emit(WindowEvent.Updated);
  };

  private onBlur = () => {
    this.state = WindowState.Background;
    this.eventEmitter.emit(WindowEvent.Updated);
  };

  private onClose = async () => {
    this.window = undefined;
    try {
      await this.eventEmitter.emit(WindowEvent.Close);
    } finally {
      this.eventEmitter.clearListeners();
    }
  };

  public async init(type: WindowType, params?: any, parent?: ElectronWindow) {
    await app.whenReady();

    const appPath = app.getAppPath();

    const windowSettings = windowsSettings.get(type)!;

    this.frame = windowSettings.frame ?? true;
    this.state = WindowState.Background;

    windowSettings.webPreferences = {
      // devTools: !app.isPackaged,
      preload: app.isPackaged
        ? path.join(appPath, "src/preload.js")
        : path.join(__dirname, "../../../preload.js"),
    };

    this.eventEmitter.on;

    if (parent) {
      windowSettings.parent = parent.window;
      windowSettings.modal = true;
    }

    const window = new BrowserWindow(windowSettings);
    this.window = window;

    window.on("focus", this.onFocus);
    window.on("blur", this.onBlur);
    window.on("closed", this.onClose);

    const query: any = {
      type: type,
    };

    if (params) {
      query.params = JSON.stringify(params);
    }

    if (app.isPackaged) {
      window.loadFile("index.html", {
        query,
      });
    } else {
      const queryStr = qs.stringify(query);
      window.loadURL(`http://localhost:8082/?${queryStr}`);
    }
  }

  public async handleIpcCall(
    method: IpcMethod,
    event: IpcMainInvokeEvent,
    args: any[],
  ): Promise<any> {
    const handler = this.ipcHandlers.get(method);
    if (handler) {
      return handler.call(this, event, ...args);
    }
  }

  public on(
    eventName: WindowEvent,
    listener: (data: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(eventName, listener);
  }

  public onContextMenu(event: ContextMenuEventData) {
    const handler = this.contextMenuActions.get(event.menu);
    if (handler) {
      handler.call(this, event);
    }
  }

  public close() {
    this.window?.close();
  }

  private toolbarWalletAction(event: ContextMenuEventData) {
    const template = [
      {
        label: "New Wallet",
        click: async () => {
          // await this.walletService.newWallet();
          await this.windowManagerService.createWindow(
            WindowType.NewWallet,
            undefined,
            this,
          );
        },
      },
      {
        label: "Import Wallet",
        click: async () => {
          await this.windowManagerService.createWindow(
            WindowType.ImportWallet,
            undefined,
            this,
          );
        },
      },
    ];
    const menu = Menu.buildFromTemplate(template as any);
    const options: PopupOptions = {
      window: this.window!,
    };
    if (event.position) {
      options.x = event.position.x;
      options.y = event.position.y + 10;
    }
    menu.popup(options);
  }

  private walletAction(event: ContextMenuEventData<{ id: string }>) {
    const template = [
      // {
      //   label: "Rename",
      //   click: () => {
      //     console.log("Rename");
      //   },
      // },

      {
        label: "Copy Address",
        click: async () => {
          const wallet = await this.walletService.getWallet(event.data.id);
          if (wallet) {
            clipboard.writeText(
              Buffer.from(wallet.accountAddress)
                .toString("hex")
                .toLocaleUpperCase(),
            );
          }
        },
      },
      {
        label: "Copy Private Key",
        click: async () => {
          const privateKey = await this.walletService.getWalletPrivateKey(
            event.data.id,
          );
          if (privateKey) {
            clipboard.writeText(
              Buffer.from(privateKey).toString("hex").toLocaleUpperCase(),
            );
          }
        },
      },
      { type: "separator" as const },
      {
        label: "Delete",
        click: async () => {
          const res = await dialog.showMessageBox({
            message: "Delete wallet",
            detail:
              "This action is irreversible. Make sure to backup your wallet.",
            type: "question",
            cancelId: 1,
            defaultId: 1,
            buttons: ["Confirm", "Cancel"],
          });
          if (res.response === 0) {
            this.walletService.deleteWallet(event.data.id);
          }
        },
      },
    ];

    const menu = Menu.buildFromTemplate(template as any);
    menu.popup({
      window: this.window!,
    });
    const options: PopupOptions = {
      window: this.window!,
    };
    if (event.position) {
      options.x = event.position.x;
      options.y = event.position.y + 10;
    }
    menu.popup(options);
  }

  private graphqlExecute(event: IpcMainInvokeEvent, operation: any) {
    return this.graphQLService.execute(operation, this);
  }

  private async graphqlSubscribe(event: IpcMainInvokeEvent, operation: any) {
    return this.graphQLService.subscribe(operation, this);
  }

  /**
   * Triggered when the client disposes the graphql subscription
   * @param subscriptionId
   */
  private async graphqlUnsubscribe(
    event: IpcMainInvokeEvent,
    subscriptionId: string,
  ) {
    this.graphQLService.unsubscribe(subscriptionId);
  }
}

export default ElectronWindow;
