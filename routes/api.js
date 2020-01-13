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

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      fetch('https://repeated-alpaca.glitch.me/v1/stock/goog/quote').then(result => {
        console.log(result.json())
        res.send(result)
      })
    });
    
};
