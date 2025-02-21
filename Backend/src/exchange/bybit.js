const axios = require('axios').create({ timeout: 10000 });

const BASE_URLS = {
  spot: 'https://api.bybit.com/api/v3',
  futures: 'https://fapi.bybit.com/fapi/v1'
};

async function fetchOHLCV(type = 'spot', params) {
  try {
    const response = await axios.get(`${BASE_URLS[type]}/klines`, {
      params: {
        symbol: params.symbol.toUpperCase(),
        interval: params.interval,
        limit: params.limit || 500,
        startTime: params.startTime,
        endTime: params.endTime
      }
    });
    
    return response.data.map(k => ({
      time: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5])
    }));
    
  } catch (error) {
    throw new Error(`Bybit API Error: ${error.response?.data?.msg || error.message}`);
  }
}

module.exports = {
  fetchBybitSpot: (params) => fetchOHLCV('spot', params),
  fetchBybitFutures: (params) => fetchOHLCV('futures', params)
};