
import { supabase } from '@/integrations/supabase/client';
import type { OHLCV, MarketDataParams, MarketType, Exchange } from '@/types/market';

export class MarketService {
  static async fetchMarketData(
    exchange: Exchange,
    marketType: MarketType,
    params: MarketDataParams
  ): Promise<OHLCV[]> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-market-data', {
        body: {
          exchange,
          marketType,
          params
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching ${marketType} data from ${exchange}:`, error);
      throw error;
    }
  }
}
