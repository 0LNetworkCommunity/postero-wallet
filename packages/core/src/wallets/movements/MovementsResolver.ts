import { Inject } from '@nestjs/common';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';

import { Types } from '../../types';
import { IMovementsService } from './interfaces';
import PaginatedMovements from './PaginatedMovements';
import { OrderDirection, PageInfo } from '../../common/paginated/types';
import { IDbService } from '../../db/interfaces';

@Resolver()
class MovementsResolver {
  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(Types.IMovementsService)
  private readonly movementsService: IMovementsService;

  @Query((returns) => PaginatedMovements)
  public async movements(
    @Args('walletAddress', { type: () => Buffer })
    walletAddress: Uint8Array,

    @Args({
      name: 'first',
      type: () => Int,
      defaultValue: 10,
    })
    first: number,

    @Args({
      name: 'after',
      type: () => String,
      nullable: true,
    })
    after: string | undefined,

    @Args({
      name: 'order',
      type: () => OrderDirection,
      defaultValue: OrderDirection.ASC,
    })
    order: OrderDirection,
  ): Promise<PaginatedMovements> {
    const r = await this.dbService
      .db('movements')
      .count('*', { as: 'total' })
      .where({
        walletAddress: this.dbService.raw(walletAddress),
      });

    const movements =
      await this.movementsService.getWalletMovements(walletAddress);

    return new PaginatedMovements(
      r[0].total as number,
      new PageInfo(false),
      movements,
    );
  }
}

export default MovementsResolver;
