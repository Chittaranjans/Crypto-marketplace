import { useState, useEffect } from 'react';
import  useWebSocket  from 'react-use-websocket';
import CandleChart from '../components/CandleChart';
import LiveTrades from '../components/LiveTrades';

interface OHLCVData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradeData {
  price: number;
  quantity: number;
  timestamp: number;
}

export default function Dashboard() {
  const [exchange, setExchange] = useState('binance');
  const [market, setMarket] = useState('spot');
  const [ohlcv, setOhlcv] = useState<OHLCVData[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);

  // WebSocket setup
  const { sendMessage, lastMessage } = useWebSocket(
     'ws://localhost:8080' ,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );

  // Fetch historical data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:3001/api/${exchange}/${market}?symbol=BTCUSDT&interval=1h&limit=100`
      );
      const data = await res.json();
      // console.log(data)
      setOhlcv(data);
    };
    fetchData();
  }, [exchange, market]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage?.data) {
      const trade = JSON.parse(lastMessage.data) as TradeData;
      // console.log(trade)
      setTrades((prev) => [trade, ...prev.slice(0, 15)]); // Keep last 10 trades
    }
  }, [lastMessage]);

  useEffect(() => {
    sendMessage(JSON.stringify({ exchange, market }));
  } , [exchange, market , sendMessage]);

  return (
    <div className="container mx-auto p-4">
      {/* Exchange Selector */}
      <select 
        className="border p-2 mr-4"
        value={exchange}
        onChange={(e) => setExchange(e.target.value)}
      >
        {['binance', 'bybit', 'mexc', 'kucoin'].map((ex) => (
          <option key={ex} value={ex}>{ex.toUpperCase()}</option>
        ))}
      </select>

      {/* Market Selector */}
      <select
        className="border p-2"
        value={market}
        onChange={(e) => setMarket(e.target.value)}
      >
        <option value="spot">Spot</option>
        <option value="futures">Futures</option>
      </select>

      {/* OHLCV Chart Component */}
      <div className="mt-4">
        <CandleChart data={ohlcv} />
      </div>

      {/* Live Trades Component */}
      <div className="mt-4">
        <LiveTrades trades={trades} />
      </div>
    </div>
  );
}