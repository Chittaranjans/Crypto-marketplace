const WebSocket = require('ws');
const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server
const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080", // Allow your frontend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to Binance WebSocket
const binanceWS = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('subscribe', (data) => {
    // Handle subscription
    console.log('Subscribe:', data);
  });

  socket.on('unsubscribe', (data) => {
    // Handle unsubscription
    console.log('Unsubscribe:', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Process Binance messages
binanceWS.on('message', (data) => {
  try {
    const trade = JSON.parse(data);
    const formatted = {
      exchange: 'binance',
      price: parseFloat(trade.p),
      quantity: parseFloat(trade.q),
      timestamp: new Date(trade.T)
    };

    // Broadcast to all connected clients
    io.emit('message', formatted);
  } catch (error) {
    console.error('Error processing trade:', error);
  }
});

// Start server
const PORT = process.env.PORT || 8081;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});

// Handle process termination
process.on('SIGINT', () => {
  httpServer.close();
  process.exit();
});