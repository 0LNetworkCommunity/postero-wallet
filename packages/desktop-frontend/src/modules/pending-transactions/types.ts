import { Buffer } from "buffer";

export enum PendingTransactionType {
  EntryFunctionPayload = "entry_function_payload",
}

export interface PendingTransaction {
  id: string;
  type: PendingTransactionType;
  payload: Buffer;
  createdAt: Date;
  dApp: {
    name: string;
  };
}

export interface RawPendingTransaction {
  id: string;
  type: string;
  payload: string;
  createdAt: number;
  dApp: {
    name: string;
  };
}