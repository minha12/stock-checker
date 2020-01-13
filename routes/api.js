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
      var like_count
      var result
      if(like) {
        like_count += 1
      }
      request(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`, (error, response, body) => {
        result = JSON.parse(body)
        if(result === 'Unknown symbol') {
          console.log('Unkown symbol')
          res.send('Unkown symbol')
        } else{
          MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if(!like) {
              console.log('Connected to MongoDB')
              db.collection('Stocks').findAndModify({
                query: {stock: stock},
                update: {
                  $setOnInsert: {likes: 0}
                },
                new: true,
                upsert: true 
              })
            }
            
            
          })
        }
        //res.json({stockData: {stock: result.symbol, price: result.latestPrice}})
        
      })
      
    });
    
};
