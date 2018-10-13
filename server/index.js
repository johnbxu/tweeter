require('dotenv').config();
"use strict";

// Basic express setup:

const PORT          = 5000;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const MongoClient   = require("mongodb").MongoClient;
const MONGODB_URI   = process.env.MONGODB_URI;
const ObjectID      = require('mongodb').ObjectID;
// const mongoose        = require('mongoose');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connects to and reads MongoDB collection in form of array
MongoClient.connect(MONGODB_URI, (err, db) => {
  // mongoose.connect(process.env.MONGODB_URI);
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  // Helper function that reads/creates tweets from/to database
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // Uses DataHelpers function to send routes to create or read tweets
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("", tweetsRoutes);
});

app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});
