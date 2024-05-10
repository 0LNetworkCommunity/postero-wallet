export interface IRpcService {}

export interface IBrowserBridge {
  id: number;
}

export interface JsonRpcIncomingMessage {
  jsonrpc: '2.0';
  method: string;
  params: unknown;
  id?: string;
}

export interface IBrowserTabFactory {
  createBrowserTab(
    id: number,
    bridge: IBrowserBridge,
    initialUrl: string,
  ): Promise<IBrowserTab>;
}

export interface IBrowserTab {
  bridge: IBrowserBridge;
  url: string;

  getId(): string;
  init(id: number, bridge: IBrowserBridge, url: string): void;
  handleMessage(rpcCall: JsonRpcIncomingMessage): Promise<unknown>;
  close(): Promise<void>;
  onClose(listener: (tab: IBrowserTab) => void): () => void;
}

export interface IBrowserTabService {
  registerTab(tab: IBrowserTab): void;
  getTabs(): Promise<IBrowserTab[]>;
}

export interface SerializedWallet {
  address: string;
  minKeysRequired: undefined; // ?: number;
  ansName: undefined; // ?: string | null;
}
