"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {

      callback(null, true);

      MongoClient.connect(MONGODB_URI, (err, database) => {
        if (err) {
          console.error(`Failed to connect: ${MONGODB_URI}`);
          throw err;
        }
        console.log(`Connected to mongodb: ${MONGODB_URI}`);
        database.collection('tweeter').insertOne(newTweet);
        database.close();
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => b.created_at - a.created_at;
      callback(null, db.tweets.sort(sortNewestFirst));
    }
  };
};
