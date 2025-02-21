import { useState, useEffect } from "react";

interface LiveTradesProps {
  trades: {
    price: number;
    quantity: number;
    timestamp: number;
  }[];
}

interface TradeData {
  price: number;
  quantity: number;
  timestamp: number;
}

export default function LiveTrades({ trades }: LiveTradesProps) {
  const [latestTrade, setLatestTrade] = useState<TradeData | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  useEffect(() => {
    if (trades.length > 0) {
      const latest = trades[0];
      setPreviousPrice(latestTrade?.price || null);
      setLatestTrade(latest);
    }
  }, [trades]);

  const getPriceColor = (currentPrice: number) => {
    if (previousPrice !== null) {
      return currentPrice > previousPrice ? 'text-green-400' : 'text-red-400';
    }
    return 'text-gray-300';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-800">
      <div className="grid grid-cols-3 px-4 py-2 text-sm font-medium bg-gray-850 border-b border-gray-700">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Time</span>
      </div>
      
      <div className="divide-y divide-gray-700">
        {trades.map((trade, i) => (
          <div 
            key={i}
            className="grid grid-cols-3 items-center px-4 py-2 hover:bg-gray-750 transition-colors text-sm"
          >
            <span className={getPriceColor(trade.price)}>
              ${trade.price.toFixed(2)}
            </span>
            <span className="text-right text-gray-300">
              {trade.quantity.toFixed(4)}
            </span>
            <span className="text-right text-gray-400">
              {new Date(trade.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}