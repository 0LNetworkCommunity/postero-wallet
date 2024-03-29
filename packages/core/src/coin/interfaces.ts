export interface ICoinRepository {
  getOrCreateCoin(coinType: string): Promise<ICoin>;
}

export interface ICoinFactory {
  createCoin(
    id: string,
    name: string,
    type: string,
    decimals: number,
    symbol: string,
  ): Promise<ICoin>;
}

export interface ICoin {
  id: string;
  name: string;
  type: string;
  decimals: number;
  symbol: string;

  init(
    id: string,
    name: string,
    type: string,
    decimals: number,
    symbol: string,
  ): void;
}