const axios = require('axios');

const SIMPLE = "simple";
const EXTENDED = "extended";

// Response:
// [
//   [
//     1499040000000,      // Open time
//     "0.01634790",       // Open
//     "0.80000000",       // High
//     "0.01575800",       // Low
//     "0.01577100",       // Close
//     "148976.11427815",  // Volume
//     1499644799999,      // Close time
//     "2434.19055334",    // Quote asset volume
//     308,                // Number of trades
//     "1756.87402397",    // Taker buy base asset volume
//     "28.46694368",      // Taker buy quote asset volume
//     "17928899.62484339" // Ignore.
//   ]
// ]
module.exports = ({ coinpair, interval = '1d', intervalNum = 7, messageType = SIMPLE }, { success, error }) => {
    axios.get(`https://api.binance.com/api/v1/klines?symbol=${coinpair}&interval=${interval}&limit=${intervalNum}`)
    .then(intervalsResult => {

        let res = [];

        intervalsResult.data.map(intervalData => {
            let priceOpen = intervalData[1]
            let priceHigh = intervalData[2]
            let priceLow = intervalData[3]
            let priceClose = intervalData[4]
            let volume = intervalData[5]
            let priceChange = ( priceHigh - priceOpen ) / priceOpen * 100
            
            switch (messageType){
                case SIMPLE: 
                    res.push(priceChange)
                    break
                case EXTENDED:
                    res.push({priceChange, priceOpen, priceHigh})
            }
        })

        success({
            message : "success",
            priceChange : res
        })

    })
    .catch(err => {
        error({
            error: err
        })
    })
  
}