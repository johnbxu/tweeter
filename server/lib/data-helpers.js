"use strict";
const bcrypt          = require('bcrypt');

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

    // Searches for the user in users collection and insert if it doesn't exist
    register: function(user, callback) {
      db.collection('users').find({'email': user.email})
        .toArray((function(err, foundUser){
          if (foundUser.length > 0) {
            callback(true, 'User already exists');
          } else {
            db.collection('users').insertOne(user);
            callback(null, user);
          }
        }));
    },

    // Checks if user exists, and if password matches
    login: function(user, callback) {
      db.collection('users').find({'email': user.email})
        .toArray(function(err, foundUser){
          if (foundUser.length < 1) {
            callback(true, '400');
          } else if (bcrypt.compareSync(user.password, foundUser[0].password)) {
            db.collection('users').updateOne(
              { 'email': user.email },
              {
                $set: { 'token': user.token }
              });
            callback(false, foundUser[0]);
          } else {
            callback(true, {loggedIn: false});
          }
        });
    },

    // checks database to see if a user is currently logged in
    checkLoggedIn: function(token, callback) {
      db.collection('users').find({'token': token})
        .toArray(function(err, foundUser) {
          if (foundUser.length < 1) {
            callback(true, 'user not logged in');
          } else {
            callback(null, true);
          }
        });
    },

    // clears token in database
    logout: function(token, callback) {
      db.collection('users').updateOne(
        {'token': token},
        {
          $set: { 'token': '' }
        });
      callback(null, 'logged out');
    },
  };
};
