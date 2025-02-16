
import { useQuery } from '@tanstack/react-query';
import { MarketService } from '@/services/marketService';
import type { MarketType, Exchange, MarketDataParams, OHLCV } from '@/types/market';

export const useMarketData = (
  exchange: Exchange,
  marketType: MarketType,
  params: MarketDataParams
) => {
  return useQuery({
    queryKey: ['marketData', exchange, marketType, params],
    queryFn: () => MarketService.fetchMarketData(exchange, marketType, params),
    refetchInterval: 60000, // Refetch every minute
    retry: 3,
  });
};
