import { ModuleRef } from "@nestjs/core";
import { Inject, Injectable } from "@nestjs/common";

import { IBalance, IBalanceFactory } from "./interfaces";
import { Types } from "../types";
import { Balance } from "./Balance";
import { ICoin } from "../coin/interfaces";

@Injectable()
class BalanceFactory implements IBalanceFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async createBalance(amount: string, coin: ICoin): Promise<IBalance> {
    const balance = await this.moduleRef.resolve<Balance>(Types.IBalance);
    balance.init(amount, coin);
    return balance;
  }
}

export default BalanceFactory;
