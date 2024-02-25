import os from "node:os";
import fs from "node:fs";
import pathUtil from "node:path";

import { Injectable, OnModuleInit } from "@nestjs/common";
import WinRegistry from "winreg";
import { app } from "electron";

// https://chromewebstore.google.com/detail/postero/obmmpbppiajcobdoedkkgckeacgdpgde
// https://addons.mozilla.org/en-US/firefox/addon/postero/

@Injectable()
export class AppService implements OnModuleInit {
  public async onModuleInit() {
    await this.installFirefoxBrowserHelper();
    await this.installChromeBrowserHelper();
  }

  private async installChromeBrowserHelper() {
    // https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging

    let browserHelperPath: string | undefined;
    let manifestLocation: string | undefined;

    const homeDir = os.homedir();

    switch (os.platform()) {
      case "darwin":
        manifestLocation = pathUtil.join(
          homeDir,
          "Library/Application Support/Google/Chrome/NativeMessagingHosts/app.postero.postero.json",
        );

        if (app.isPackaged) {
        } else {
          browserHelperPath = pathUtil.join(
            __dirname,
            "../../../browser-helper/target/debug/browser-helper",
          );
        }
        break;

      case "linux":
        manifestLocation = pathUtil.join(
          homeDir,
          ".config/google-chrome/NativeMessagingHosts/app.postero.postero.json",
        );

        if (app.isPackaged) {
        } else {
          browserHelperPath = pathUtil.join(
            __dirname,
            "../../../browser-helper/target/debug/browser-helper",
          );
        }
        break;

      case "win32":
        {
          manifestLocation = pathUtil.join(
            homeDir,
            "\\AppData\\Local\\Postero\\app\\app.postero.postero.json",
          );

          if (app.isPackaged) {
          } else {
            browserHelperPath = pathUtil.join(
              __dirname,
              "../../../browser-helper/target/debug/browser-helper.exe",
            );
          }

          const regKey = new WinRegistry({
            hive: WinRegistry.HKCU,
            key: "\\Software\\Google\\Chrome\\NativeMessagingHosts\\app.postero.postero",
          });
          await new Promise<void>((resolve, reject) => {
            regKey.set(
              WinRegistry.DEFAULT_VALUE,
              WinRegistry.REG_SZ,
              manifestLocation!,
              (error) => {
                console.log('>>>', error);
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              },
            );
          });
        }
        break;
    }

    const manifest = {
      name: "app.postero.postero",
      description: "Postero host for native messaging",
      path: browserHelperPath,
      type: "stdio",
      allowed_origins: [
        "chrome-extension://obmmpbppiajcobdoedkkgckeacgdpgde/"
      ]
    };

    if (!manifestLocation || !browserHelperPath) {
      console.error(`platform ${os.platform} not supported`);
      return;
    }

    await fs.promises.mkdir(pathUtil.basename(manifestLocation), {
      recursive: true,
    });
    await fs.promises.writeFile(manifestLocation, JSON.stringify(manifest));
  }

  private async installFirefoxBrowserHelper() {
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_manifests#manifest_location

    let browserHelperPath: string | undefined;
    let manifestLocation: string | undefined;

    const homeDir = os.homedir();

    switch (os.platform()) {
      case "darwin":
        manifestLocation = pathUtil.join(
          homeDir,
          "Library/Application Support/Mozilla/NativeMessagingHosts",
        );
        break;

      case "linux":
        manifestLocation = pathUtil.join(
          homeDir,
          ".mozilla/native-messaging-hosts",
        );
        break;

      case "win32":
        break;
    }

    if (app.isPackaged) {
    } else {
      browserHelperPath = pathUtil.join(
        __dirname,
        "../../../browser-helper/target/debug/browser-helper",
      );
    }

    const manifest = {
      name: "app.postero.postero",
      description: "Postero host for native messaging",
      path: browserHelperPath,
      type: "stdio",
      allowed_extensions: ["postero@postero.app"],
    };

    if (!manifestLocation || !browserHelperPath) {
      console.error(`platform ${os.platform} not supported`);
      return;
    }

    await fs.promises.mkdir(manifestLocation, { recursive: true });
    await fs.promises.writeFile(
      pathUtil.join(manifestLocation, "app.postero.postero.json"),
      JSON.stringify(manifest),
    );
  }
}
