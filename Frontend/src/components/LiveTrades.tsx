interface LiveTradesProps {
    trades: {
      price: number;
      quantity: number;
      timestamp: number;
    }[];
  }
  
  export default function LiveTrades({ trades }: LiveTradesProps) {
    return (
      <div className="bg-white p-4 rounded shadow">
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
    );
  }