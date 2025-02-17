const express = require('express');
const router = express.Router();
const { fetchBinanceFutures} = require('../exchange/binance');
const { fetchBybitFutures} = require('../exchange/bybit');
const { fetchMexcFutures} = require('../exchange/mexc');
const { fetchKucoinFutures} = require('../exchange/kucoin');

// const {
//     fetchBinanceFutures,
//   fetchBybitFutures,
//   fetchMexcFutures,
//   fetchKucoinFutures
// } = require('../exchange');

router.get('/binance/futures', async (req, res) => {
  try {
    const data = await fetchBinanceFutures(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    }
});

router.get('/bybit/futures', async (req, res) => {
  try {
    const data = await fetchBybitFutures(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/mexc/futures', async (req, res) => {
  try {
    const data = await fetchMexcFutures(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/kucoin/futures', async (req, res) => {
  try {
    const data = await fetchKucoinFutures(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
// Similar routes for bybit/spot, mexc/spot, kucoin/spot