export enum PendingTransactionStatus {
  Unknown = "Unknown",
  OnChain = "OnChain",
  Expired = "Expired",
}

export interface PendingTransaction {
  id: string;
  hash: string | null;
  status: PendingTransactionStatus;
  expirationTimestamp: number;
}
