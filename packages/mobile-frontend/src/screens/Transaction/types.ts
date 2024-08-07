export enum PendingTransactionStatus {
  Unknown = "Unknown",
  OnChain = "OnChain",
  Expired = "Expired",
}

export interface UserTransaction {
  __typename: "UserTransaction";
  arguments: string;
  functionName: string;
  hash: string;
  moduleAddress: string;
  moduleName: string;
  sender: string;
  success: boolean;
  timestamp: string;
  version: string;
}

export interface PendingTransaction {
  hash: string | null;
  status: PendingTransactionStatus;
  expirationTimestamp: number;
  updating: boolean;
  createdAt: number;

  transaction: null | UserTransaction;
}
