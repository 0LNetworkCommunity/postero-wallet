import { registerEnumType } from "@nestjs/graphql";

export enum WindowType {
  Main,
  Settings,
  ImportWallet,
  Wallet,
  NewWallet,
}

export enum WindowEvent {
  Close,
  Updated,
}

export enum ContextMenu {
  ToolbarWalletAction,
  WalletAction,
}

export interface ContextMenuEventData<T = undefined> {
  menu: ContextMenu;
  position?: { x: number; y: number };
  data: T;
}

export enum WindowState {
  Foreground = "Foreground",
  Background = "Background",
}

registerEnumType(WindowState, {
  name: "WindowState",
});
