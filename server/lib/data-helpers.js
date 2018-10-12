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

    updateLikes: function(id, likes, liked, callback) {
      callback(null);
      db.collection('tweets').updateOne(
        { 'id' : id },
        {
          $set: { 'likes': likes, 'liked': liked}
        });
    },

    login: function(user, callback) {
      db.collection('users').find({'email': user.email})
        .toArray((function(err, foundUser){
          if (foundUser.length < 1) {
            callback(true, '400');
          } else if (bcrypt.compareSync(user.password, foundUser[0].password)) {
            callback(false, {loggedIn: true});
          } else {
            callback(true, {loggedIn: false});
          }
        }));
    },

    // this function should take user object, search database with parameters
    // and determine if the user exists. if not, update database. if yes,
    // it should respond
    register: function(user, callback) {
      //search

      db.collection('users').find({'email': user.email})
        .toArray((function(err, foundUser){
          if (foundUser.length > 1) {
            callback(true, 'User already exists');
          } else {
            db.collection('users').insertOne(user);
            callback(null, user);
          }
        // else
        // callback('User does not exist');
        }));
    },

  };
};
