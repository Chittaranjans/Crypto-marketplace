const WebSocket = require('ws');
const ReconnectingWebSocket = require('reconnecting-websocket');

// Binance Spot
const binanceWS = new ReconnectingWebSocket(
  'wss://stream.binance.com:9443/ws/btcusdt@trade',
  [],
  { WebSocket }
);

// ByBit Spot
const bybitWS = new ReconnectingWebSocket(
  'wss://stream.bybit.com/v5/public/spot',
  [],
  { WebSocket }
);

const wss = new WebSocket.Server({ port: 8080 });

// Handle exchange connections
const exchanges = {
  binance: handleBinance,
  bybit: handleBybit,
  mexc: handleMexc,
  kucoin: handleKucoin
};

function handleBinance(ws) {
  binanceWS.onmessage = (event) => {
    const trade = JSON.parse(event.data);
    ws.send(JSON.stringify({
      exchange: 'binance',
      price: parseFloat(trade.p),
      quantity: parseFloat(trade.q),
      timestamp: trade.T
    }));
  };
}

function handleBybit(ws) {
  bybitWS.onmessage = (event) => {
    const trade = JSON.parse(event.data);
    ws.send(JSON.stringify({
      exchange: 'bybit',
      price: parseFloat(trade.data.price),
      quantity: parseFloat(trade.data.size),
      timestamp: trade.data.timestamp
    }));
  };
}

function handleMexc(ws) {
  mexcWS.onmessage = (event) => {
    const trade = JSON.parse(event.data);
    ws.send(JSON.stringify({
      exchange: 'mexc',
      price: parseFloat(trade.price),
      quantity: parseFloat(trade.quantity),
      timestamp: trade.time
    }));
  };
}

function handleKucoin(ws) {
  kucoinWS.onmessage = (event) => {
    const trade = JSON.parse(event.data);
    ws.send(JSON.stringify({
      exchange: 'kucoin',
      price: parseFloat(trade.data.price),
      quantity: parseFloat(trade.data.size),
      timestamp: trade.data.timestamp
    }));
  };
}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { exchange } = JSON.parse(message);
    if (exchanges[exchange]) {
      exchanges[exchange](ws);
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