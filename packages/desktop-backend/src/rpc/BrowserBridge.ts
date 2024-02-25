import { Socket } from "node:net";
import { WebSocket, RawData } from "ws";
import { Inject, Injectable } from "@nestjs/common";

import { RpcMethod } from "./methods";
import {
  IBrowserBridge,
  IBrowserTab,
  IBrowserTabFactory,
  IBrowserTabService,
  JsonRpcIncomingMessage,
} from "./interfaces";
import { Types } from "../types";

@Injectable()
class BrowserBridge implements IBrowserBridge {
  public id!: number;

  public socket!: Socket;

  public webSocket!: WebSocket;

  private readonly tabs = new Map<number, IBrowserTab>();

  @Inject(Types.IBrowserTabFactory)
  private readonly browserTabFactory!: IBrowserTabFactory;

  @Inject(Types.IBrowserTabService)
  private readonly browserTabService!: IBrowserTabService;

  public init(id: number, socket: Socket, webSocket: WebSocket) {
    this.id = id;
    this.socket = socket;
    this.webSocket = webSocket;

    this.webSocket.on("error", (error) => this.onError(error));
    this.webSocket.on("message", (data, isBinary) =>
      this.onMessage(data, isBinary),
    );
  }

  private onError(error: Error) {
    console.log(error);
  }

  private async onMessage(data: RawData, isBinary: boolean) {
    if (isBinary) {
      console.error("unsupported binary message");
      return;
    }

    try {
      const message = JSON.parse(
        data.toString("utf-8"),
      ) as JsonRpcIncomingMessage;

      const params = message.params as any[];

      if (message.id) {
        const tabId = parseInt(message.id.split("::")[0], 10);

        if (message.method === RpcMethod.Init) {
          const url = params[0] as string;
          this.handleInit(tabId, url);
        } else {
          const tab = this.tabs.get(tabId);
          if (!tab) {
            console.warn(`tab ${tabId} not found`);
            return;
          }

          const result = await tab.handleMessage(message);
          this.webSocket.send(
            JSON.stringify({
              jsonrpc: "2.0",
              id: message.id,
              result,
            }),
          );
        }
      } else {
        if (message.method === RpcMethod.TabDisconnect) {
          const params = message.params as [number];
          const tabId = params[0];

          const tab = this.tabs.get(tabId);
          if (!tab) {
            console.warn(`tab ${tabId} not found`);
            return;
          }
          tab.close();
        } else {
          console.warn(`unsupported notification ${message.method}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async handleInit(tabId: number, url: string) {
    if (this.tabs.has(tabId)) {
      throw new Error("tab id is already assigned");
    }

    const tab = await this.browserTabFactory.createBrowserTab(tabId, this, url);
    this.tabs.set(tabId, tab);

    tab.onClose((tab: IBrowserTab) => {
      this.onTabClose(tabId, tab);
    });

    this.browserTabService.registerTab(tab);
  }

  private onTabClose(tabId: number, tab: IBrowserTab) {
    this.tabs.delete(tabId);
  }
}

export default BrowserBridge;
