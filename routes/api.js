/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
var fetch = require('node-fetch')
var expect = require('chai').expect;
var MongoClient = require('mongodb');
var request = require('request')

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      var stock = req.query.stock
      console.log('Stock: ' + stock)
      var like = req.query.like
      console.log(like)
      var ip = req.connection.remoteAddress
      
      
      
      const stockHandler = (stock, like, ip) =>{
        request(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`, (error, response, body) => {
        var result = JSON.parse(body)
        if(result === 'Unknown symbol') {
          console.log('Unkown symbol')
          return 'Unkown symbol'
        } else{
          MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if(!like) {//check if the stock is available in db, likes remain intact
              console.log('Connected to MongoDB')
              db.collection('Stocks').findOneAndUpdate(
                {stock: stock},
                {
                  $setOnInsert: {stock: stock, likes: []}
                },
                {
                  returnOriginal: false,
                  upsert: true
                },
                (error, data) => {
                  console.log(data.value)
                  return {stockData: {stock: result.symbol, price: result.latestPrice, likes: data.value.likes.length}}
                }
              )
            }else{//update likes
              db.collection('Stocks').findOneAndUpdate(
              {stock: stock},
              {
                $addToSet: {likes: ip}
              },
              {
                returnOriginal: false,
                upsert: true
              },
              (error, data) => {
                console.log(data)
                return {
                  stockData: 
                    {stock: result.symbol, 
                     price: result.latestPrice, 
                     likes: data.value.likes.length
                    }}
              })
            }
            
            
          })
        }
        //res.json({stockData: {stock: result.symbol, price: result.latestPrice}})
        
      })
      }
      
      if(Array.isArray(stock)){
        var stockData1 =  stockHandler(stock[0], like, ip)
          var stockData2 =  stockHandler(stock[1], like, ip)
        ;(async () => {
          
          var resp = await [stockData1, stockData2 ]
           await console.log(resp)
           await res.json(resp)

          })()
      }
      
      
    });
    
};
