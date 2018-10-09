"use strict";

// Requiring a JSON file automatically parses it and returns the data. These
// are just example tweets to make it less tedious to style the app initially.
const db = {
  tweets: {}
};

module.exports = db;

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

MongoClient.connect(MONGODB_URI, (err, database) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  database.collection("tweets").find().toArray((err, tweets) => {
    db.tweets = tweets;
    console.log(db);
    database.close();
  });
});