"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to MongoDB database
    saveTweet: function(newTweet, callback) {
      callback(null, true);
      db.collection('tweets').insertOne(newTweet);
    },

    // Get all tweets in MongoDB database, sorted by newest first
    getTweets: function(callback) {
      let sortedCollection;
      db.collection('tweets').find().toArray((err, tweets) => {
        sortedCollection = tweets;
        const sortNewestFirst = (a, b) => b.created_at - a.created_at;
        callback(null, sortedCollection.sort(sortNewestFirst));
      });
    },

    // Searches for the tweet and updates its likes and liked information
    updateLikes: function(tweet, callback) {
      callback(null);
      db.collection('tweets').updateOne(
        { 'id' : tweet.id },
        {
          $set: { 'likes': tweet.likes, 'liked': tweet.liked}
        });
    },
  };
};
