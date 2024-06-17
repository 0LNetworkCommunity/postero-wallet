import { Buffer } from "buffer";
import { Decimal } from "decimal.js";
import { GqlMovement, GqlTransaction } from "./gql-types";
import { Transaction, Movement, GenesisTransaction, UserTransaction, BlockMetadataTransaction, ScriptUserTransaction } from "./types";
import { BN } from "bn.js";

export const gqlTransactionMapper = (gqlTransaction: GqlTransaction): Transaction => {
  switch (gqlTransaction.__typename) {
    case "GenesisTransaction":
      return new GenesisTransaction({
        version: new BN(gqlTransaction.version),
        hash: Buffer.from(gqlTransaction.hash, 'hex'),
      });

    case "UserTransaction":
      return new UserTransaction({
        version: new BN(gqlTransaction.version),
        hash: Buffer.from(gqlTransaction.hash, 'hex'),
        timestamp: new BN(gqlTransaction.timestamp),
        success: gqlTransaction.success,
        moduleAddress: Buffer.from(gqlTransaction.moduleAddress, "hex"),
        moduleName: gqlTransaction.moduleName,
        functionName: gqlTransaction.functionName,
        sender: Buffer.from(gqlTransaction.sender, "hex"),
        arguments: gqlTransaction.arguments,
      });

    case "ScriptUserTransaction":
      return new ScriptUserTransaction({
        version: new BN(gqlTransaction.version),
        hash: Buffer.from(gqlTransaction.hash, 'hex'),
        timestamp: new BN(gqlTransaction.timestamp),
        success: gqlTransaction.success,
        sender: Buffer.from(gqlTransaction.sender, "hex"),
      });

    case "BlockMetadataTransaction":
      return new BlockMetadataTransaction({
        version: new BN(gqlTransaction.version),
        hash: Buffer.from(gqlTransaction.hash, 'hex'),
        timestamp: new BN(gqlTransaction.timestamp),
        epoch: new BN(gqlTransaction.epoch),
      });
  }

  throw new Error(`Invalid transaction type ${(gqlTransaction as any).__typename}`);
}


export const gqlMovementMapper = (gqlMovement: GqlMovement): Movement => {
  return new Movement({
    balance: new Decimal(gqlMovement.balance),
    lockedBalance: new Decimal(gqlMovement.lockedBalance),
    // amount: new Decimal(gqlMovement.amount),
    lockedAmount: new Decimal(gqlMovement.lockedAmount),
    unlockedAmount: new Decimal(gqlMovement.unlockedAmount),
    transaction: gqlTransactionMapper(gqlMovement.transaction),
    version: new BN(gqlMovement.version),
  });
}
