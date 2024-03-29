import { Inject, Injectable } from "@nestjs/common";

import { ICoin, ICoinFactory, ICoinRepository } from "./interfaces";
import { IOpenLibraService } from "../open-libra/interfaces";
import { IDbService } from "../db/interfaces";
import { Types } from "../types";
import { PlatformTypes } from "../platform/platform-types";
import { PlatformCryptoService } from "../platform/interfaces";

@Injectable()
class CoinRepository implements ICoinRepository {
  @Inject(Types.IOpenLibraService)
  private readonly openLibraService: IOpenLibraService;

  @Inject(Types.IDbService)
  private readonly dbService: IDbService;

  @Inject(Types.ICoinFactory)
  private readonly coinFactory: ICoinFactory;

  @Inject(PlatformTypes.CryptoService)
  private readonly platformCryptoService: PlatformCryptoService;

  public async getOrCreateCoin(coinType: string): Promise<ICoin> {
    const coin = await this.dbService
      .db<{
        id: string;
        type: string;
        name: string;
        decimals: number;
        symbol: string;
      }>("coins")
      .where("type", coinType)
      .first();
    if (coin) {
      return this.coinFactory.createCoin(
        coin.id,
        coin.name,
        coin.type,
        coin.decimals,
        coin.symbol,
      );
    }

    const res = await this.openLibraService.getAccountResource(
      new Uint8Array([0x01]),
      `0x1::coin::CoinInfo<${coinType}>`,
    );

    const data = res.data as {
      decimals: number;
      name: string;
      symbol: string;
    };

    const id = this.platformCryptoService.randomUUID();
    const [newCoin] = await this.dbService
      .db<{
        id: string;
        type: string;
        name: string;
        decimals: number;
        symbol: string;
      }>("coins")
      .insert({
        id,
        type: coinType,
        name: data.name,
        decimals: data.decimals,
        symbol: data.symbol,
      })
      .returning(["id", "type", "name", "decimals", "symbol"]);
    return this.coinFactory.createCoin(
      `${newCoin.id}`,
      newCoin.name,
      newCoin.type,
      newCoin.decimals,
      newCoin.symbol,
    );
  }
}

export default CoinRepository;
