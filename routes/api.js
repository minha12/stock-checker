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
      var appResponse
      
      
      
      const stockHandler = (stock, like, ip, callback) =>{
        return new Promise(waitForData => {
          request(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`, (error, response, body) => {
          var result = JSON.parse(body)
          if(result === 'Unknown symbol') {
            console.log('Unkown symbol')
            callback({stockData: 'Unkown symbol'})
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
                    //console.log(data.value)
                    callback( {stockData: {stock: result.symbol, price: result.latestPrice, likes: data.value.likes.length}})
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
                  //console.log(data)
                  callback({ stockData: {stock: result.symbol, price: result.latestPrice, likes: data.value.likes.length }})
                })
              }


            })
          }
          //res.json({stockData: {stock: result.symbol, price: result.latestPrice}})

        })//end of request
        })//end of Promise
        
      }
      const callBack = (data) => {
        //console.log(data)
        return new Promise(waitForData => {
          waitForData(data)
        })
      }
      
      if(Array.isArray(stock)){
        // console.log(stock[0])
        // var myPromise1 = new Promise((resolve, reject) => {
        //   if(true) {
        //     resolve(stockHandler(stock[0], like, ip, callBack))
        //   } else{
        //     reject('Something wrong')
        //   }
        // })
        // var myPromise2 = new Promise((resolve, reject) => {
        //   if(true) {
        //     resolve(stockHandler(stock[1], like, ip, callBack))
        //   } else{
        //     reject('Something wrong')
        //   }
        // })
        const stock1 = stockHandler(stock[0], like, ip, callBack)
        const stock2 = stockHandler(stock[1], like, ip, callBack)
        Promise.all([stock1, stock2])
          .then(data => {
                console.log(data[0])
                console.log(data[1])
               })

        // myPromise1.then(result => {
        //   console.log(result)
        // })
        // myPromise2.then(result => {
        //   console.log(result)
        // })
 
      }
      
      
    });
    
};
