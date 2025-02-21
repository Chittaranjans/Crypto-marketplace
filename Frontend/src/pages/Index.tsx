import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import CandleChart from '../components/CandleChart';
import LiveTrades from '../components/LiveTrades';
import BTCLogo from '../../public/BTC.svg';
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
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [ohlcv, setOhlcv] = useState<OHLCVData[]>([]);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [latestTrade, setLatestTrade] = useState<TradeData | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  // WebSocket setup

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

  const getWebSocketSymbol = (symbol: string) => symbol.toLowerCase();

  const { sendMessage, lastMessage } = useWebSocket(
    `ws://localhost:8080`,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      onOpen: () => {
        sendMessage(JSON.stringify({ exchange, symbol: getWebSocketSymbol(symbol) }));
      },
      onError: (event) => {
        console.error('WebSocket error:', event);
      },
      onClose: (event) => {
        console.log('WebSocket closed:', event);
      },
    }
  );

  // Fetch historical data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:3001/api/${exchange}/${market}?symbol=${symbol}&interval=1h&limit=100`
      );
      const data = await res.json();
      // console.log(data);
      setOhlcv(data);
    };
    fetchData();
  }, [exchange, market , symbol]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage?.data) {
      const trade = JSON.parse(lastMessage.data) as TradeData;
      //console.log(trade);
      setTrades((prev) => [trade, ...prev.slice(0, 20)]); // Keep last 10 trades
    }
  }, [lastMessage]);

  // Send exchange selection to WebSocket server
  useEffect(() => {
    sendMessage(JSON.stringify({ exchange }));
  }, [exchange, sendMessage]);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 p-4 flex items-center justify-center border-b border-gray-700">
        <img src={BTCLogo} alt="BTC Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-white text-xl font-semibold">Crypto-data visualizer</h1>
      </div>
  
  <nav className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <select 
          className="border border-gray-600 px-3 py-2 rounded-md bg-gray-700 text-sm text-white hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
        >
          {['binance', 'bybit', 'mexc', 'kucoin'].map((ex) => (
            <option key={ex} value={ex}>{ex.toUpperCase()}</option>
          ))}
        </select>
        <select
          className="border border-gray-600 px-3 py-2 rounded-md bg-gray-700 text-sm text-white hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={market}
          onChange={(e) => setMarket(e.target.value)}
        >
          <option value="spot">Spot</option>
          <option value="futures">Futures</option>
        </select>
        <select
          className="border border-gray-600 px-3 py-2 rounded-md bg-gray-700 text-sm text-white hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option value="BTCUSDT">BTCUSDT</option>
          <option value="ETHUSDT">BTCUSD</option>
          <option value="ETHBTC">ETHUSD</option>
        </select>
      </div>
      
      {/* Price Display */}
      {latestTrade && (
      <div className="ml-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className={`${getPriceColor(latestTrade.price)} font-semibold`}>
          ${latestTrade.price.toFixed(2)}</span>
          <span className="text-green-400 text-sm">+2.4%</span>
        </div>
        <div className="text-gray-400 text-sm">
          24h: <span className="text-green-400 font-semibold">{previousPrice && (
            `${latestTrade.price > previousPrice ? '+' : ''}${((latestTrade.price - previousPrice)/previousPrice * 100).toFixed(2)}%`
          )}</span>
        </div>
      </div>
    
        )}
    </div>
  
    <div className="flex space-x-1">
      {['1m', '5m', '15m', '1H', '4H', '1D'].map((tf) => (
        <button 
          key={tf}
          className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-sm transition-colors"
        >
          {tf}
        </button>
      ))}
    </div>
  </nav>


  <div className="flex-1 flex">
    <div className="flex-1 flex flex-col">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex space-x-2">
          <button className="px-2 py-1 text-sm hover:bg-gray-700 rounded">✚</button>
          <button className="px-2 py-1 text-sm hover:bg-gray-700 rounded">📊</button>
          <button className="px-2 py-1 text-sm hover:bg-gray-700 rounded">⚙️</button>
        </div>
       
      </div>
      
      {/* Chart Container */}
      <div className="flex-1 relative">
        <CandleChart data={ohlcv} />
      </div>
    </div>

    {/* Live Trades Sidebar */}
    <div className="w-80 border-l border-gray-800 flex flex-col">
  <div className="p-4 bg-gray-800 border-b border-gray-700">
    <h2 className="font-semibold text-lg">BTC/USD Trades</h2>
    {latestTrade && (
      <div className="mt-2 text-sm">
        <span className={getPriceColor(latestTrade.price)}>
          ${latestTrade.price.toFixed(2)}
        </span>
        <span className="ml-2 text-gray-400 text-xs">
          {previousPrice && (
            `${latestTrade.price > previousPrice ? '+' : ''}${((latestTrade.price - previousPrice)/previousPrice * 100).toFixed(2)}%`
          )}
        </span>
      </div>
    )}
  </div>
  <LiveTrades trades={trades} />
</div>
  </div>
</div>
  );
}