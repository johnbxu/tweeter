"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to MongoDB database
    saveTweet: function(newTweet, callback) {
      callback(null, true);
      MongoClient.connect(MONGODB_URI, (err, database) => {
        if (err) {
          console.error(`Failed to connect: ${MONGODB_URI}`);
          throw err;
        }
        database.collection('tweets').insertOne(newTweet);
        database.close();
      });
    },

    // Get all tweets in MongoDB database, sorted by newest first
    getTweets: function(callback) {
      MongoClient.connect(MONGODB_URI, (err, database) => {
        if (err) {
          console.error(`Failed to connect: ${MONGODB_URI}`);
          throw err;
        }
        database.collection("tweets").find().toArray((err, tweets) => {
          let getDB = { tweets: tweets };
          const sortNewestFirst = (a, b) => b.created_at - a.created_at;
          callback(null, getDB.tweets.sort(sortNewestFirst));
          database.close();
        });
      });
    }
  };
};
