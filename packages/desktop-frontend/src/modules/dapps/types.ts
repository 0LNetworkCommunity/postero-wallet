export enum DAppStatus {
  Connected = "Connected",
  Unknown = "Unknown",
}

export interface ConnectionRequest {
  id: string;
  dApp?: DApp;
  createdAt: Date;
}

export interface RawConnectionRequest {
  id: string;
  createdAt: number;
}

export interface DApp {
  id: string;
  host: string;
  name: string;
  description?: string;
  icon?: string;
  status: DAppStatus;
  connectionRequests: ConnectionRequest[];
}

export type RawDApp = Omit<DApp, "connectionRequests"> & {
  connectionRequests: RawConnectionRequest[];
};