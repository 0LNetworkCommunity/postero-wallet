import Emittery, { UnsubscribeFn } from "emittery";
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
} from "@postero/core";

@ObjectType({
  implements: () => [AbstractWindow],
})
class ElectronWindow implements IWindow {
  public frame: boolean;

  public state: WindowState;

  private readonly eventEmitter = new Emittery();

  public async init(type: WindowType, params?: any, parent?: IWindow): Promise<void> {
    this.frame = false;
    this.state = WindowState.Foreground;
  }

  public on(
    eventName: WindowEvent,
    listener: (data: any) => void | Promise<void>,
  ): UnsubscribeFn {
    return this.eventEmitter.on(eventName, listener);
  }

  public onContextMenu(event: ContextMenuEventData): void {

  }

  public close(): void {

  }
}