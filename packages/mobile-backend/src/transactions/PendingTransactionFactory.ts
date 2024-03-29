import { Inject, Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { IPendingTransaction, IPendingTransactionFactory, RawPendingTransactionPayloadType } from "./interfaces";
import { Types } from "../types";
import { IDApp } from "../dapps/interfaces";

@Injectable()
class PendingTransactionFactory implements IPendingTransactionFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async getPendingTransaction(
    id: string,
    dApp: IDApp,
    type: RawPendingTransactionPayloadType,
    payload: Buffer,
    createdAt: Date,
  ): Promise<IPendingTransaction> {
    const pendingTransaction = await this.moduleRef.resolve<IPendingTransaction>(
      Types.IPendingTransaction,
    );
    pendingTransaction.init(
      id,
      dApp,
      type,
      payload,
      createdAt,
    );
    return pendingTransaction;
  }
}

export default PendingTransactionFactory;
