import { BrowserWindow, IpcMainInvokeEvent } from "electron";
import { UnsubscribeFn } from "emittery";

import { WindowType, WindowEvent, ContextMenuEventData } from "./types";
import { IpcMethod } from "../ipc/methods";

export interface IWindowManagerSerivce {
  createWindow(
    type: WindowType,
    params?: any,
    parent?: IWindow,
  ): Promise<IWindow>;
}

export interface IWindow {
  window?: BrowserWindow;
  init(type: WindowType, params?: any, parent?: IWindow): Promise<void>;
  on(
    eventName: WindowEvent,
    listener: (data: any) => void | Promise<void>,
  ): UnsubscribeFn;
  onContextMenu(event: ContextMenuEventData): void;

  // handleIpcCall(
  //   method: IpcMethod,
  //   event: IpcMainInvokeEvent,
  //   args: any,
  // ): Promise<any>;
}

export interface IWindowFactory {
  createWindow(
    type: WindowType,
    params?: any,
    parent?: IWindow,
  ): Promise<IWindow>;
}

export interface IPlatformWindowManagerService {
}
