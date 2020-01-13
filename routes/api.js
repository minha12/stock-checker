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
      request('https://repeated-alpaca.glitch.me/v1/stock/goog/quote', (err, res, body) => {
        var result = JSON.parse(body)
        console.log(result)
        res.json(result.latestPrice)
      })
    });
    
};
