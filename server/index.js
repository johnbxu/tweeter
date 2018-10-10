"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const MongoClient   = require("mongodb").MongoClient;
const MONGODB_URI   = "mongodb://localhost:27017/tweeter";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connects to and reads MongoDB collection in form of array
const db = {tweets: {}};
MongoClient.connect(MONGODB_URI, (err, database) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  database.collection("tweets").find().toArray((err, tweets) => {
    db.tweets = tweets;
    database.close();
  });
});

// Helper function that reads/creates tweets from/to database
const DataHelpers = require("./lib/data-helpers.js")(db);

// Uses DataHelpers function to send routes to create or read tweets
const tweetsRoutes = require("./routes/tweets")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:
app.use("/tweets", tweetsRoutes);

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
