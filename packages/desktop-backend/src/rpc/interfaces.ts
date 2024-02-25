import { Socket } from 'node:net';
import { WebSocket } from 'ws';

export interface IRpcService {}

export interface IBrowserBridge {
  id: number;
  socket: Socket;
  webSocket: WebSocket;

  init(id: number, socket: Socket, webSocket: WebSocket): void;
}

export interface JsonRpcIncomingMessage {
  jsonrpc: '2.0';
  method: string;
  params: unknown;
  id?: string;
}

export interface IBrowserBridgeFactory {
  createBrowserBridge(
    bridgeId: number,
    socket: Socket,
    ws: WebSocket,
  ): Promise<IBrowserBridge>;
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
  address: string,
  publicKey: string;
  minKeysRequired: undefined, // ?: number;
  ansName: undefined, // ?: string | null;
}