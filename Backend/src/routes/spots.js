const express = require('express');
const router = express.Router();
const { fetchSpotOHLCV }= require('../exchange/binance');

router.get('/binance/spot', async (req, res) => {
  try {
    const { symbol, interval, limit } = req.query;
        const data = await fetchSpotOHLCV(symbol, interval, limit);
        res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Repeat for ByBit, MEXC, KuCoin...

module.exports = router;