
export interface PendingTransactionInput {
  status: string;
  hash: Uint8Array;
  createdAt: number;
}

export class PendingTransaction {
  public readonly status: string;

  public readonly hash: Uint8Array;

  public readonly createdAt: Date;

  public constructor(input: PendingTransactionInput) {
    this.status = input.status;
    this.hash = input.hash;
    this.createdAt = new Date(input.createdAt);
  }
}