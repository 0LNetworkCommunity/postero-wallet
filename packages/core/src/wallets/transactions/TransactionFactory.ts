import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import {
  ITransactionFactory,
} from './interfaces';
import { Types } from '../../types';
import { IScriptUserTransaction, ScriptUserTransactionInput } from './ScriptUserTransaction';
import { BlockMetadataTransactionInput, IBlockMetadataTransaction } from './BlockMetadataTransaction';
import { IUserTransaction, UserTransactionInput } from './UserTransaction';
import { GenesisTransactionInput, IGenesisTransaction } from './GenesisTransaction';

@Injectable()
export class TransactionFactory implements ITransactionFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async createUserTransaction(
    args: UserTransactionInput,
  ): Promise<IUserTransaction> {
    const userTransaction = await this.moduleRef.resolve<IUserTransaction>(
      Types.IUserTransaction,
    );
    userTransaction.init(args);
    return userTransaction;
  }

  public async createGenesisTransaction(
    input: GenesisTransactionInput,
  ): Promise<IGenesisTransaction> {
    const genesisTransaction = await this.moduleRef.resolve<IGenesisTransaction>(
      Types.IGenesisTransaction,
    );
    genesisTransaction.init(input);
    return genesisTransaction;
  }

  public async createScriptUserTransaction(
    input: ScriptUserTransactionInput,
  ): Promise<IScriptUserTransaction> {
    const scriptUserTransaction = await this.moduleRef.resolve<IScriptUserTransaction>(
      Types.IScriptUserTransaction,
    );
    scriptUserTransaction.init(input);
    return scriptUserTransaction;
  }

  public async createBlockMetadataTransaction(
    input: BlockMetadataTransactionInput,
  ): Promise<IBlockMetadataTransaction> {
    const blockMetadataTransaction = await this.moduleRef.resolve<IBlockMetadataTransaction>(
      Types.IBlockMetadataTransaction,
    );
    blockMetadataTransaction.init(input);
    return blockMetadataTransaction;
  }
}
