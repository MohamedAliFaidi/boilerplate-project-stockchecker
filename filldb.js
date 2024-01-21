// const mongoose = require('mongoose')

// require('dotenv').config();
// mongoose.connect(process.env.DB).then(() => console.log('database well connected')).catch(err => console.log(err))


// const stockSchema = new mongoose.Schema({
//   name: { type: String, require: true },
//   price: { type: Number, require: true },
//   likes: {
//     type: Number, default: 0
//   },
//   ips: [String]
// })

// const Stock =   mongoose.model("Stock", stockSchema);




const data = [
    {
        name: "aapl",
        price: 891,
        likes: 0,
        ips:[]
    },
    {
        name: "goog",
        price: 258,
        likes: 0,
        ips:[]
    },
    {
        name: "msft",
        price: 140,
        likes: 0,
        ips:[]
    },
]



data.forEach(async function(e,i){
    const newStock = await Stock.create(e)
    console.log(newStock)
})


module.exports = Stock






