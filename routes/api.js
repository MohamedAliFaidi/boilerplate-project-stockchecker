"use sctrict";
const fetchStockData = require("../controllers/convertHandler");

const mongoose = require("mongoose");

require("dotenv").config();
mongoose
  .connect(process.env.DB)
  .then(() => console.log("database well connected"))
  .catch((err) => console.log(err));

const stockSchema = new mongoose.Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  likes: {
    type: Number,
    default: 0,
  },
  ips: [String],
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = function (app) {
  app.route("/api/stock-prices").get(async function (req, res) {
    const ipAddress = req.headers["x-forwarded-for"] ? req.headers["x-forwarded-for"] :"127.0.0.1";
    console.log(ipAddress);
    try {
      if (!Array.isArray(req.query.stock)) {
        console.log(req.query);
        let stockData = await Stock.findOne({ name: req.query.stock });
        if (req.query.like == "true") {
          console.log(stockData.ips);

          if (!stockData.ips.includes(ipAddress)) {
            stockData  =await  Stock.findOneAndUpdate({name: stockData.name})
            stockData.likes = stockData.likes + 1;
            stockData.ips.push(ipAddress);
            stockData= await stockData.save({new:true});
            const say = { stockData: {
              stock: stockData.name,
              price: stockData.price,
              likes: stockData.likes ,
            }}
            setTimeout(() => {
              res.json(say);
            }, 2000);
          } else if(stockData.ips.includes(ipAddress)) {
            console.log(stockData.ips)
            res.json({
              stockData: {
                stock: stockData.name,
                price: stockData.price,
                likes: stockData.likes,
              },
              Error: "Only 1 Like per IP Allowed",
            });
          }
        } else {
          res.json({
            stockData: {
              stock: stockData.name,
              price: stockData.price,
              likes: stockData.likes,
            },
          });
        }
        // Send the response{stock:stockData.symbol.toLowerCase(),price:stockData.latestPrice,likes:20}
      } else {
        let stocks = [];
        const first = await Stock.findOne({
          name: req.query.stock[0],
        });
        const second = await Stock.findOne({
          name: req.query.stock[1],
        });
        stocks.push({
          stock: first.name,
          price: first.price,
          rel_likes: first.likes - second.likes,
        });
        stocks.push({
          stock: first.name,
          price: first.price,
          rel_likes: first.likes - second.likes,
        });

        setTimeout(() => {
          res.json({ stockData: stocks });
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
