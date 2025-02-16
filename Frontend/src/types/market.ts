
export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketDataParams {
  symbol: string;
  interval: string;
  limit: number;
}

export type MarketType = 'spot' | 'futures';
export type Exchange = 'binance' | 'bybit' | 'mexc' | 'kucoin';
