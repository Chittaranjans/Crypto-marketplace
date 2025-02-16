const axios = require('axios');
// const { response } = require('express');


const fetchSpotOHLCV = async (symbol , interval , limit) => {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
          params: { symbol: symbol.toUpperCase(), interval, limit: limit || 100 }
        });
        
        const data = response.data.map(k => ({
          time: k[0],
          open: k[1],
          high: k[2],
          low: k[3],
          close: k[4],
          volume: k[5]
        }));
        

      } catch (error) {
        throw new Error(error.message); 
      }
    };

module.exports = { fetchSpotOHLCV };