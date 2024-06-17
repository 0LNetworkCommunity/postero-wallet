import { Args, Resolver, Query } from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { Types } from '../../types';
import { ITransactionsRepository } from './interfaces';
import { AbstractTransaction } from './AbstractTransaction';

@Resolver()
export class TransactionsResolver {
  public constructor(
    @Inject(Types.ITransactionsRepository)
    private readonly transactionsRepository: ITransactionsRepository,
  ) {}
  @Query(() => AbstractTransaction, { nullable: true })
  public async transaction(
    @Args('hash', { type: () => Buffer })
    hash: Uint8Array,
  ) {
    return this.transactionsRepository.getTransactionByHash(hash);
  }
}
