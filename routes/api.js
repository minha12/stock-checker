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
      var stock = req.body.stock
      console.log('Stock: ' + stock)
      var like = req.body.like
      var like_count = 0
      if(like) {
        like_count += 1
      }
      request(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`, (error, response, body) => {
        var result = JSON.parse(body)
        console.log(result)
        res.json({stockData: {stock: result.symbol, price: result.latestPrice}})
      })
    });
    
};
