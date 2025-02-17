const express = require('express');
const cors = require('cors');
const spotsRouter = require('./routes/spots');
const futuresRouter = require('./routes/futures');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', spotsRouter);
app.use('/api', futuresRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});