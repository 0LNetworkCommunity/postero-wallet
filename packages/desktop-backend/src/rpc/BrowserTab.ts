import { Notification } from "electron";
import Emittery from "emittery";
import { Inject, Injectable } from "@nestjs/common";
import { RpcMethod } from "./methods";
import {
  JsonRpcIncomingMessage,
  IBrowserTab,
  IBrowserBridge,
  SerializedWallet,
} from "./interfaces";
import { IConnectionRequest, IDApp, IDAppService } from "../dapps/interfaces";
import { Types } from "../types";
import {
  IPendingTransactionsService,
  RawPendingTransactionPayload,
} from "../transactions/interfaces";
import Wallet from "../crypto/Wallet";

@Injectable()
class BrowserTab implements IBrowserTab {
  public id!: number;

  public bridge!: IBrowserBridge;

  public url!: string;

  @Inject(Types.IDAppService)
  private readonly dAppService!: IDAppService;

  @Inject(Types.IPendingTransactionsService)
  private readonly pendingTransactionsService!: IPendingTransactionsService;

  private readonly eventEmitter = new Emittery();

  private dApp?: IDApp;

  private pendingconnection?: Promise<SerializedWallet | null>;

  private connectionRequest?: IConnectionRequest;

  private readonly rpcMethods = new Map<RpcMethod, (...args: any[]) => any>([
    [RpcMethod.Connect, this.appConnect],
    [RpcMethod.Disconnect, this.appDisconnect],
    [RpcMethod.SignMessage, this.signMessage],
    [RpcMethod.SignAndSubmitTransaction, this.signAndSubmitTransaction],
  ]);

  public init(id: number, bridge: IBrowserBridge, url: string) {
    this.id = id;
    this.bridge = bridge;
    this.url = url;
  }

  public getId(): string {
    return `${this.bridge.id}::${this.id}`;
  }

  public async handleMessage(
    rpcCall: JsonRpcIncomingMessage,
  ): Promise<unknown> {
    const handler = this.rpcMethods.get(rpcCall.method as RpcMethod);
    if (!handler) {
      throw new Error(`invalid method ${rpcCall.method}`);
    }
    return handler.apply(this, rpcCall.params as any[]);
  }

  /**
   * Method called when the browser tab is closed
   */
  public async close(): Promise<void> {
    if (this.connectionRequest) {
      await this.connectionRequest.cancel();
      this.connectionRequest = undefined;
    }

    try {
      await this.eventEmitter.emit("close", this);
    } finally {
      this.eventEmitter.clearListeners();
    }
  }

  /**
   * Attach a listener triggered when the tab is closed.
   * @param listener Method to execute
   *
   * Retruns a method to remove the listener.
   */
  public onClose(listener: (tab: IBrowserTab) => void): () => void {
    const cb = () => {
      listener(this);
    };

    this.eventEmitter.on("close", cb);

    return () => {
      this.eventEmitter.off("close", cb);
    };
  }

  /**
   * Method called when the DApp running in the tab call the disconnect method
   */
  private async appDisconnect() {
    new Notification({
      title: "disconnect",
    }).show();
  }

  private async requestConnection(url: string): Promise<Wallet | null> {
    if (!this.connectionRequest) {
      if (!this.dApp) {
        const dApp = await this.dAppService.getOrCreateDApp(url);
        this.dApp = dApp;
      }
      this.connectionRequest = await this.dApp.connect(this);
    }
    return this.connectionRequest.wait();
  }

  private connect(url: string): Promise<SerializedWallet | null> {
    return new Promise<SerializedWallet | null>(
      (resolve, reject) => {
        this.requestConnection(url)
          .then((wallet: Wallet | null) => {
            if (wallet) {
              resolve({
                address: Buffer.from(wallet.accountAddress)
                  .toString("hex")
                  .toUpperCase(),
                publicKey: Buffer.from(wallet.publicKey)
                  .toString("hex")
                  .toUpperCase(),
                minKeysRequired: undefined, // ?: number;
                ansName: undefined, // ?: string | null;
              });
            } else {
              resolve(null);
            }
          })
          .catch(reject);
      },
    );
  }

  /**
   * Method called when the DApp running in the tab call the connect method
   */
  private async appConnect(url: string) {
    console.log('appConnect', url);

    if (!this.pendingconnection) {
      this.pendingconnection = this.connect(url);
    }
    return this.pendingconnection;
  }

  private async signMessage(message: any) {
    new Notification({
      title: "notif-title",
      body: message,
    }).show();
  }

  private async signAndSubmitTransaction(
    transaction: RawPendingTransactionPayload,
  ) {
    if (!this.dApp) {
      throw new Error("Not connected");
    }

    await this.pendingTransactionsService.newTransaction(
      this.dApp,
      transaction,
    );
  }
}

export default BrowserTab;
