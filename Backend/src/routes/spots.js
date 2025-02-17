const express = require('express');
const router = express.Router();
const { fetchBinanceSpot } = require('../exchange/binance');
const { fetchBybitSpot } = require('../exchange/bybit');
const { fetchMexcSpot } = require('../exchange/mexc');
const { fetchKucoinSpot } = require('../exchange/kucoin');

// const {
//   fetchBinanceSpot,
//   fetchBybitSpot,
//   fetchMexcSpot,
//   fetchKucoinSpot
// } = require('../exchange');

router.get('/binance/spot', async (req, res) => {
  try {
    const data = await fetchBinanceSpot(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/bybit/spot', async (req, res) => {
  try {
    const data = await fetchBybitSpot(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/mexc/spot', async (req, res) => {
  try {
    const data = await fetchMexcSpot(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/kucoin/spot', async (req, res) => {
  try {
    const data = await fetchKucoinSpot(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
// Similar routes for bybit/spot, mexc/spot, kucoin/spot