import { Inject, Injectable } from "@nestjs/common";
import { ICoin, ICoinFactory } from "./interfaces";
import { ModuleRef } from "@nestjs/core";
import { Types } from "../types";

@Injectable()
class CoinFactory implements ICoinFactory {
  @Inject()
  private readonly moduleRef: ModuleRef;

  public async createCoin(
    id: string,
    name: string,
    type: string,
    decimals: number,
    symbol: string,
  ): Promise<ICoin> {
    const coin = await this.moduleRef.resolve<ICoin>(Types.ICoin);
    coin.init(id, name, type, decimals, symbol);
    return coin;
  }
}

export default CoinFactory;

