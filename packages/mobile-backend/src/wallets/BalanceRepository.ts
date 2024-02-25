import { Inject, Injectable } from "@nestjs/common";

import { Types } from "../types";
import { IDbService } from "../db/interfaces";
import { IBalanceFactory, IBalanceRepository } from "./interfaces";
import Bluebird from "bluebird";
import { ICoinFactory } from "../coin/interfaces";
import Balance from "./Balance";

@Injectable()
class BalanceRepository implements IBalanceRepository {
  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(Types.IBalanceFactory)
  private readonly balanceFactory: IBalanceFactory;

  @Inject(Types.ICoinFactory)
  private readonly coinFactory: ICoinFactory;

  public async getBalances(walletId: string): Promise<Balance[]> {
    const rows = await this.dbService
      .db<{ id: number; coinId: number; walletId: number; balance: string }>(
        "balances",
      )
      .select("balances.*", {
        coinId: "coins.id",
        coinType: "coins.type",
        coinName: "coins.name",
        coinDecimals: "coins.decimals",
        coinSymbol: "coins.symbol",
      })
      .where("walletId", walletId)
      .leftJoin("coins", "balances.coinId", "coins.id");
    
    return Bluebird.map(rows, async (row) => {
      const coin = await this.coinFactory.createCoin(
        row.coinId,
        row.coinName,
        row.coinType,
        row.coinDecimals,
        row.coinSymbol,
      );
      const balances = await this.balanceFactory.createBalance(
        row.amount,
        coin,
      );
      return balances;
    });
  }
}

export default BalanceRepository;
