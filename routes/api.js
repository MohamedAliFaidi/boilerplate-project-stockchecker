'use sctrict'
const fetchStockData = require('../controllers/convertHandler');

module.exports = function (app) {
  app.route('/api/stock-prices').get(async function (req, res) {
    const stockSymbol = req.query.stock;
    const like = req.query.like === 'true';
    const ipAddress = req.socket.remoteAddress;

    try {
      // Fetch stock data and handle likes
      const remoteAddress = req.socket.remoteAddress;

      console.log(remoteAddress+ 'ip')
      const stockData = await fetchStockData(stockSymbol, like, ipAddress);
      console.log(stockData);

      // Send the response
      res.json({stockData: stockData});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};
