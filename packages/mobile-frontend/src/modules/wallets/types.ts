export interface Coin {
  id: string;
  decimals: number;
  symbol: string;
}

export interface Balance {
  amount: string;
  coin: Coin;
}