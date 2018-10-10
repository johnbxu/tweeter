const MongoClient   = require("mongodb").MongoClient;
const MONGODB_URI   = "mongodb://localhost:27017/tweeter";
const collection    = 'tweets';

// Connects to MongoDB and returns a collection in an array

const db = function () {
  let database;
  return MongoClient.connect(MONGODB_URI).then(db => {
    database = db;
    // console.log(database);
    console.log(database.collection('tweets').find().toArray((err, tweets) => {return tweets;}));

    return database.collection('tweets').find().toArray((err, tweets) => {return tweets;});
  }).then(() => {
    database.close(true);
  }).catch(err => {
    database.close(true);
    throw err;
  });
}();
//     (err, db) => {
//     if (err) {
//       console.error(`Failed to connect: ${MONGODB_URI}`);
//       throw err;
//     }
//     database.collection('tweets').find().toArray((err, tweets) => {
//       data.tweets = [].concat(tweets);
//       console.log(data);
//       database.close();
//     }).then(return data)
//   });
//   console.log (data);
// }();

module.exports = db;