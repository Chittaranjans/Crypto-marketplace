import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import io from "socket.io-client";
import { toast } from "sonner";

const socket = io('http://localhost:8081' , {
  withCredentials: true,
  transports:['websocket' , 'polling']
});

const TRADING_PAIRS = [
  { symbol: 'btcusdt', name: 'BTC/USDT' },
  { symbol: 'ethusdt', name: 'ETH/USDT' },
  { symbol: 'bnbusdt', name: 'BNB/USDT' },
  { symbol: 'solusdt', name: 'SOL/USDT' },
];

const fetchCryptoData = async () => {
  const response = await fetch('https://api.http://localhost:3001/api/binance/spot?symbol=BTCUSDT&interval=1h&limit=100'); //.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd&include_24hr_change=true');
  return response.json();
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPair, setSelectedPair] = useState(TRADING_PAIRS[0]);
  const [realtimePrice, setRealtimePrice] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastTrades, setLastTrades] = useState<{ price: number; quantity: number; time: string }[]>([]);
  
  const { data: cryptoData, isLoading, error } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchCryptoData,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      toast.success('Connected to WebSocket');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      toast.error('Disconnected from WebSocket');
    };

    const handleError = (error: Error) => {
      toast.error(`WebSocket error: ${error.message}`);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);
    };
  }, []);

  useEffect(() => {
    // Unsubscribe from previous stream
    if (socket.connected) {
      socket.emit('unsubscribe', {
        method: 'UNSUBSCRIBE',
        params: TRADING_PAIRS.map(pair => `${pair.symbol}@trade`),
        id: 1
      });
    }

    const streamName = `${selectedPair.symbol}@trade`;
    
    socket.emit('subscribe', {
      method: 'SUBSCRIBE',
      params: [streamName],
      id: 1
    });

    const handleMessage = (data: any) => {
      if (data.e === 'trade') {
        const price = parseFloat(data.p);
        const quantity = parseFloat(data.q);
        setRealtimePrice(price);
        
        setChartData(prev => {
          const newData = [...prev, {
            time: new Date().toLocaleTimeString(),
            price: price
          }];
          
          if (newData.length > 24) {
            return newData.slice(-24);
          }
          return newData;
        });

        setLastTrades(prev => {
          const newTrades = [{
            price,
            quantity,
            time: new Date().toLocaleTimeString()
          }, ...prev];
          return newTrades.slice(0, 5);
        });
      }
    };

    socket.on('message', handleMessage);

    return () => {
      socket.emit('unsubscribe', {
        method: 'UNSUBSCRIBE',
        params: [streamName],
        id: 1
      });
      socket.off('message', handleMessage);
    };
  }, [selectedPair]);

  const renderStatCard = (title: string, value: string | number, change: number) => (
    <Card className="stats-card">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">${value}</h3>
        </div>
        <div className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="ml-1 text-sm">{Math.abs(change).toFixed(2)}%</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Crypto Dashboard</h1>
        <div className="flex gap-4 items-center">
          <Select
            value={selectedPair.symbol}
            onValueChange={(value) => setSelectedPair(TRADING_PAIRS.find(pair => pair.symbol === value) || TRADING_PAIRS[0])}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select pair" />
            </SelectTrigger>
            <SelectContent>
              {TRADING_PAIRS.map((pair) => (
                <SelectItem key={pair.symbol} value={pair.symbol}>
                  {pair.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search cryptocurrency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!isLoading && cryptoData && (
          <>
            {renderStatCard("Bitcoin", cryptoData.bitcoin?.usd.toLocaleString() || "0", cryptoData.bitcoin?.usd_24h_change || 0)}
            {renderStatCard("Ethereum", cryptoData.ethereum?.usd.toLocaleString() || "0", cryptoData.ethereum?.usd_24h_change || 0)}
            {renderStatCard("Ripple", cryptoData.ripple?.usd.toLocaleString() || "0", cryptoData.ripple?.usd_24h_change || 0)}
          </>
        )}
      </div>

      {realtimePrice && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Real-time {selectedPair.name}</span>
              <span className="text-lg font-bold">${realtimePrice.toLocaleString()}</span>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-2">Recent Trades</h3>
            <div className="space-y-2">
              {lastTrades.map((trade, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>${trade.price.toLocaleString()}</span>
                  <span className="text-muted-foreground">{trade.quantity.toFixed(4)} {selectedPair.name.split('/')[0]}</span>
                  <span className="text-muted-foreground">{trade.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Card className="p-6 chart-container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Price Chart</h2>
            {!isConnected && (
              <div className="flex items-center text-destructive">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Disconnected</span>
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.length > 0 ? chartData : Array.from({ length: 24 }, (_, i) => ({
              time: `${i}:00`,
              price: 30000 + Math.random() * 2000,
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: "var(--background)", borderColor: "var(--border)" }} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <Card className="p-6 text-center text-destructive">
          <p>Error loading crypto data. Please try again later.</p>
        </Card>
      )}
    </div>
  );
};

export default Index;