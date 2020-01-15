/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
var fetch = require("node-fetch");
var expect = require("chai").expect;
var MongoClient = require("mongodb");
var request = require("request");

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  app.route("/api/stock-prices").get(function(req, res) {
    var stock = req.query.stock;
    console.log("Stock: " + stock);
    var like = req.query.like;
    console.log(like);
    var ip = req.connection.remoteAddress;
    var appResponse;

    const stockHandler = (stock, like, ip) => {
      return new Promise(waitForData => {
        request(
          `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`,
          (error, response, body) => {
            var result = JSON.parse(body);
            if (result === "Unknown symbol") {
              console.log("Unkown symbol");
              let returnData = { stockData: "Unkown symbol" };
              waitForData(returnData);
            } else {
              MongoClient.connect(CONNECTION_STRING, (err, db) => {
                if (!like) {
                  //check if the stock is available in db, likes remain intact
                  console.log("Connected to MongoDB");
                  db.collection("Stocks").findOneAndUpdate(
                    { stock: stock },
                    {
                      $setOnInsert: { stock: stock, likes: [] }
                    },
                    {
                      returnOriginal: false,
                      upsert: true
                    },
                    (error, data) => {
                      //console.log(data.value)
                      var returnData = {
                        stockData: {
                          stock: result.symbol,
                          price: result.latestPrice,
                          likes: data.value.likes.length
                        }
                      };
                      waitForData(returnData);
                    }
                  );
                } else {
                  //update likes
                  db.collection("Stocks").findOneAndUpdate(
                    { stock: stock },
                    {
                      $addToSet: { likes: ip }
                    },
                    {
                      returnOriginal: false,
                      upsert: true
                    },
                    (error, data) => {
                      //console.log(data)
                      var returnData = {
                        stockData: {
                          stock: result.symbol,
                          price: result.latestPrice,
                          likes: data.value.likes.length
                        }
                      };
                      waitForData(returnData);
                    }
                  );
                }
              });
            }
            //res.json({stockData: {stock: result.symbol, price: result.latestPrice}})
          }
        ); //end of request
      }); //end of Promise
    };

    if (Array.isArray(stock)) {
      const stock1 = stockHandler(stock[0], like, ip);
      const stock2 = stockHandler(stock[1], like, ip);
      Promise.all([stock1, stock2]).then(data => {
        console.log(data[0]);
        console.log(data[1]);
        stock1 = data[0]
        stock2 = data[1]
        
        
      });
    } //end of if Array
  }); //end of app.route --> .get
};
