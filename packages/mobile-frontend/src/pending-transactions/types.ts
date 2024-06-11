
export interface PendingTransactionInput {
  id: string;
  status: string;
  createdAt: number;
}

export class PendingTransaction {
  public readonly id: string;

  public readonly status: string;

  public readonly createdAt: Date;

  public constructor(input: PendingTransactionInput) {
    this.id = input.id;
    this.status = input.status;
    this.createdAt = new Date(input.createdAt);
  }
}