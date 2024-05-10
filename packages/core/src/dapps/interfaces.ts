import { UnsubscribeFn } from "emittery";
import { registerEnumType } from "@nestjs/graphql";

import Wallet from "../crypto/Wallet";
import { IBrowserTab } from "../rpc/interfaces";

export interface DAppMetadata {
  url: string;
  icon: Buffer;
  name: string;
  description: string;
}

export interface DAppEntity {
  id: number;
  host: string;
  name: string;
  description?: string;
  icon?: Buffer;
}

export interface IDAppRepository {
  getDApp(id: string): Promise<IDApp | null>;
  getDAppFromHost(host: string): Promise<IDApp | null>;
  saveDApp(host: string, metadata: DAppMetadata): Promise<IDApp>;
  getDApps(): Promise<IDApp[]>;
  getDAppsById(ids: string[]): Promise<IDApp[]>;
}

export enum DAppServiceEvent {
  NewDApp = "NewDApp",
  DAppStatusChange = "DAppStatusChange",
  ConnectionRequest = "ConnectionRequest",
  ConnectionRequestRemoved = "ConnectionRequestRemoved",
}

export interface IDAppService {
  getDApp(id: string): Promise<IDApp | null>;
  getDApps(): Promise<IDApp[]>;
  registerDAppInstance(dAppInstance: IDAppInstance): Promise<void>;
  isDAppConnected(dApp: IDApp): boolean;
  getDAppInstance(url: string): Promise<IDAppInstance>;
  getOrCreateDApp(url: string): Promise<IDApp>;
  onConnectionRequest(connectionRequest: IConnectionRequest): void;
  approveConnectionRequest(
    connectionRequestId: string,
    walletAddress: Uint8Array,
  ): Promise<boolean>;
  denyConnectionRequest(connectionRequestId: string): Promise<boolean>;
  getDAppsById(ids: string[]): Promise<IDApp[]>;

  on(
    event: DAppServiceEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn;
}

export enum DAppEvent {
  ConnectionRequest = "ConnectionRequest",
}

export enum ConnectionRequestEvent {
  Approve = "Approve",
  Deny = "Deny",
  Cancel = "Cancel",
}

export enum DAppStatus {
  Connected,
  Unknown,
}

registerEnumType(DAppStatus, {
  name: "DAppStatus",
});

export interface IDApp {
  id: string;
  name: string;
  host: string;
  description?: string;
  icon?: Buffer;

  init(entity: DAppEntity): void;
  connect(browserTab: IBrowserTab): Promise<IConnectionRequest>;

  on(
    event: DAppEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn;
}

export interface IDAppInstance {
  dApp: IDApp;

  init(dApp: IDApp): void;

  attachBrowserTab(browserTab: IBrowserTab): void;
  getBrowserTabs(): IBrowserTab[];
  onDeactivate(listener: (dApp: IDAppInstance) => void): () => void;
}

export interface IDAppInstanceFactory {
  getDAppInstance(dApp: IDApp): Promise<IDAppInstance>;
}

export interface IDAppFactory {
  getDApp(entity: DAppEntity): Promise<IDApp>;
}

export type IDAppResolver = {};

export interface IConnectionRequest {
  id: string;
  browserTab: IBrowserTab;
  dApp: IDApp;

  init(id: string, browserTab: IBrowserTab, dApp: IDApp): void;
  wait(): Promise<Wallet | null>;
  notify(): void;
  cancel(): Promise<void>;
  approve(wallet: Wallet): Promise<void>;
  deny(): Promise<void>;

  on(
    event: ConnectionRequestEvent,
    listener: (eventData: any) => void | Promise<void>,
  ): UnsubscribeFn;
}

export interface IConnectionRequestFactory {
  getConnectionRequest(
    id: string,
    browserTab: IBrowserTab,
    dApp: IDApp,
  ): Promise<IConnectionRequest>;
}
