'use sctrict'
const fetchStockData = require('../controllers/convertHandler');
const mongoose = require('mongoose')

require('dotenv').config();
console

mongoose.connect(process.env.DB).then(() => console.log('database well connected')).catch(err => console.log(err))


const stockSchema = new mongoose.Schema({
  name: { type: String, require: true },
  likes: {
    type: Number, default: 0
  },
  ips: [String]
})

const Stock =   mongoose.model("Stock", stockSchema);


module.exports = function (app) {
  app.route('/api/stock-prices').get(async function (req, res) {

    const stockSymbol = req.query.stock;
    const like = req.query.like === 'true';
    const ipAddress = req.headers['x-forwarded-for'];
    try {
     
      if(!Array.isArray((req.query.stock))){
        const stockData = await fetchStockData(stockSymbol, like, ipAddress);
        // Send the response{stock:stockData.symbol.toLowerCase(),price:stockData.latestPrice,likes:20}
        res.json({ stockData:{stock:stockData.symbol.toLowerCase(),price:stockData.latestPrice,likes:20} });

      }
      else {// Fetch stock data and handle likes
        let stocks =[]
        req.query.stock.forEach(async (element) => {
          const stockData = await fetchStockData(element, like, ipAddress)
          const stock ={}
          stock.stock = stockData.symbol?.toLowerCase() 
          stock.price =  stockData.latestPrice
          stock.rel_likes=0
          console.log(stock)
          stocks.push(stock)})
          setTimeout(() =>
         { console.log(stocks)
        res.json({ stockData:stocks})}
        , 1000);
        }
        
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};
