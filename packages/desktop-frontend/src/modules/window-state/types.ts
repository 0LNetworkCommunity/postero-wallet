export enum WindowState {
  Foreground = "Foreground",
  Background = "Background",
}

export interface Window {
  frame: boolean;
  state: WindowState;
}

