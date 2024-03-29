import process from "node:process";
import { BrowserWindowConstructorOptions } from "electron";

import { WindowType } from "@postero/core";

const isMac = process.platform === "darwin";

export const windowsSettings = new Map<WindowType, BrowserWindowConstructorOptions>([
  [
    WindowType.Main,
    {
      frame: !isMac,
      titleBarStyle: isMac ? "hidden" : "default",
      trafficLightPosition: {
        x: 12,
        y: 11,
      },
      show: true,
      width: 1024,
      height: 728,
      vibrancy: "sidebar",
    },
  ],
  [
    WindowType.Settings,
    {
      frame: !isMac,
      titleBarStyle: isMac ? "hidden" : "default",
      trafficLightPosition: {
        x: 12,
        y: 11,
      },
      resizable: false,
      show: true,
      width: 772,
      height: 572,
    },
  ],

  [WindowType.ImportWallet, {}],

  [
    WindowType.Wallet,
    {
      frame: !isMac,
      titleBarStyle: isMac ? "hidden" : "default",
      trafficLightPosition: {
        x: 12,
        y: 11,
      },
      resizable: true,
      show: true,
      width: 772,
      height: 572,
    },
  ],

  [
    WindowType.NewWallet,
    {
      frame: !isMac,
      titleBarStyle: isMac ? "hidden" : "default",
      trafficLightPosition: {
        x: 12,
        y: 11,
      },
      resizable: true,
      show: true,
      width: 772,
      height: 572,
    },
  ],
]);
