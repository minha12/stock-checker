"use strict";
var fetch = require("node-fetch");
var expect = require("chai").expect;
const { MongoClient, ServerApiVersion } = require('mongodb');
var request = require("request");
require('dotenv').config();

const client = new MongoClient(process.env.DB, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB once
let connected = false;
async function connectDB() {
  if (!connected) {
    await client.connect();
    connected = true;
  }
}

module.exports = function(app) {
  app.route("/api/stock-prices").get(function(req, res) {
    var stock = req.query.stock;
    console.log("Stock: " + stock);
    var like = req.query.like;
    console.log(like);
    var ip = req.connection.remoteAddress;

    const stockHandler = async (stock, like, ip) => {
      return new Promise(waitForData => {
        request(
          `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`,
          async (error, response, body) => {
            var result = JSON.parse(body);
            if (result === "Unknown symbol") {
              let returnData = { stockData: "Unknown symbol" };
              waitForData(returnData);
            } else {
              try {
                await connectDB();
                const collection = client.db().collection("Stocks");
                
                if (!like) {
                  const data = await collection.findOneAndUpdate(
                    { stock: stock },
                    { $setOnInsert: { stock: stock, likes: [] } },
                    { returnDocument: 'after', upsert: true }
                  );
                  
                  waitForData({
                    stockData: {
                      stock: result.symbol,
                      price: result.latestPrice,
                      likes: data.likes ? data.likes.length : 0
                    }
                  });
                } else {
                  const data = await collection.findOneAndUpdate(
                    { stock: stock },
                    { $addToSet: { likes: ip } },
                    { returnDocument: 'after', upsert: true }
                  );
                  
                  waitForData({
                    stockData: {
                      stock: result.symbol,
                      price: result.latestPrice,
                      likes: data.likes ? data.likes.length : 0
                    }
                  });
                }
              } catch (err) {
                console.error('Database error:', err);
                waitForData({ error: 'Error accessing database' });
              }
            }
          }
        );
      });
    };

    if (Array.isArray(stock)) {
      let stock1 = stockHandler(stock[0], like, ip);
      let stock2 = stockHandler(stock[1], like, ip);
      Promise.all([stock1, stock2]).then(data => {
        console.log(data[0]);
        console.log(data[1]);
        stock1 = data[0].stockData;
        stock2 = data[1].stockData;
        if (stock1 === "Unknown symbol" || stock2 === "Unkown symbol") {
          const result = [stock1];
          result.push(stock2);
          res.json({ stockData: result });
        } else {
          const result = {
            stockData: [
              {
                stock: stock1.stock,
                price: stock1.price,
                rel_likes: stock1.likes - stock2.likes
              },
              {
                stock: stock2.stock,
                price: stock2.price,
                rel_likes: stock2.likes - stock1.likes
              }
            ]
          };
          res.json(result);
        }
      });
    }else{//end of if Array
      let stockData = stockHandler(stock, like, ip)
      stockData.then(data => {
        console.log(data)
        res.json(data)
      })
      
    } 
  }); //end of app.route --> .get
};
