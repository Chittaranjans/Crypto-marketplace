const WebSocket = require('ws');
const ReconnectingWebSocket = require('reconnecting-websocket');

const wss = new WebSocket.Server({ port: 8080 });

// Handle exchange connections
const exchanges = {
  binance: handleBinance,
  bybit: handleBybit,
  mexc: handleMexc,
  kucoin: handleKucoin
};

function createReconnectingWebSocket(url) {
  return new ReconnectingWebSocket(url, [], { WebSocket });
}

function handleBinance(ws, symbol) {
  const binanceWS = createReconnectingWebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
  binanceWS.onmessage = (event) => {
    const trade = JSON.parse(event.data);
    ws.send(JSON.stringify({
      exchange: 'binance',
      price: parseFloat(trade.p),
      quantity: parseFloat(trade.q),
      timestamp: trade.T
    }));
  };

  binanceWS.onerror = (error) => {
    console.error('Binance WebSocket error:', error);
  };

  binanceWS.onclose = () => {
    console.log('Binance WebSocket closed');
  };
}

function handleBybit(ws, symbol) {
  const bybitWS = createReconnectingWebSocket(`wss://stream.bybit.com/v5/public/spot/${symbol}@trade`);
  bybitWS.onmessage = (event) => {
    const trade = JSON.parse(event.data);
    ws.send(JSON.stringify({
      exchange: 'bybit',
      price: parseFloat(trade.data.price),
      quantity: parseFloat(trade.data.size),
      timestamp: trade.data.timestamp
    }));
  };

  bybitWS.onerror = (error) => {
    console.error('Bybit WebSocket error:', error);
  };

  bybitWS.onclose = () => {
    console.log('Bybit WebSocket closed');
  };
}

function handleMexc(ws, symbol) {
  const mexcWS = createReconnectingWebSocket(`wss://stream.mexc.com/ws/${symbol}@trade`);
  mexcWS.onmessage = (event) => {
    const trade = JSON.parse(event.data);
    ws.send(JSON.stringify({
      exchange: 'mexc',
      price: parseFloat(trade.price),
      quantity: parseFloat(trade.quantity),
      timestamp: trade.time
    }));
  };

  mexcWS.onerror = (error) => {
    console.error('Mexc WebSocket error:', error);
  };

  mexcWS.onclose = () => {
    console.log('Mexc WebSocket closed');
  };
}

function handleKucoin(ws, symbol) {
  const kucoinWS = createReconnectingWebSocket(`wss://stream.kucoin.com/ws/${symbol}@trade`);
  kucoinWS.onmessage = (event) => {
    const trade = JSON.parse(event.data);
    ws.send(JSON.stringify({
      exchange: 'kucoin',
      price: parseFloat(trade.data.price),
      quantity: parseFloat(trade.data.size),
      timestamp: trade.data.timestamp
    }));
  };

  kucoinWS.onerror = (error) => {
    console.error('Kucoin WebSocket error:', error);
  };

  kucoinWS.onclose = () => {
    console.log('Kucoin WebSocket closed');
  };
}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { exchange, symbol } = JSON.parse(message);
    if (exchanges[exchange]) {
      exchanges[exchange](ws, symbol);
    } else {
      ws.send(JSON.stringify({ error: 'Unknown exchange' }));
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:8080');