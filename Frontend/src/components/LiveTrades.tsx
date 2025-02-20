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
  const [showSidebar, setShowSidebar] = useState(false);
  const [latestTrade, setLatestTrade] = useState<TradeData | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  useEffect(() => {
    if (trades.length > 0) {
      const latest = trades[0];
      setPreviousPrice(latestTrade?.price || null);
      setLatestTrade(latest);
    }
  }, [trades]);

  const getPriceColor = () => {
    if (latestTrade && previousPrice !== null) {
      return latestTrade.price > previousPrice ? 'text-green-500' : 'text-red-500';
    }
    return 'text-black';
  };

  return (
    <div className="flex ">
      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-4">
        <div className="mt-4">
          {latestTrade && (
            <h2 className="text-lg">
              BTC/USD Price:
              <span className={`text-xl ${getPriceColor()}`}>
                 ${latestTrade.price.toFixed(2)}
              </span>
            </h2>
          )}
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      {!showSidebar && (
        <button
          className="fixed right-0 top-0 m-4 p-2 bg-blue-500 text-white rounded"
          onClick={() => setShowSidebar(true)}
        >
          Show Trades
        </button>
      )}

      {/* Live Trades Sidebar */}
      {showSidebar && (
        <div className="w-64 bg-white p-4 rounded shadow fixed right-0 top-0 h-full overflow-y-auto">
          <h2 className="text-xl mb-4">Live Trades</h2>
          <div className="space-y-2">
            {trades.map((trade, i) => (
              <div key={i} className="border-b pb-2">
                <p className="font-semibold">Price: ${trade.price.toFixed(2)}</p>
                <p>Quantity: {trade.quantity.toFixed(4)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(trade.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
