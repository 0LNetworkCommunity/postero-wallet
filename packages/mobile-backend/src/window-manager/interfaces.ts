import { UnsubscribeFn } from 'emittery';
import { WindowType, WindowEvent, ContextMenuEventData } from './types';

export interface IWindowManagerSerivce {
  createWindow(
    type: WindowType,
    params?: any,
    parent?: IWindow,
  ): Promise<IWindow>;
}

export interface IWindow {
  init(type: WindowType, params?: any, parent?: IWindow): Promise<void>;
  on(
    eventName: WindowEvent,
    listener: (data: any) => void | Promise<void>,
  ): UnsubscribeFn;
  onContextMenu(event: ContextMenuEventData): void;
  close(): void;
}

export interface IWindowFactory {
  createWindow(
    type: WindowType,
    params?: any,
    parent?: IWindow,
  ): Promise<IWindow>;
}

export interface IPlatformWindowManagerService {}
