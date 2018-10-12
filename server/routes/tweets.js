'use strict';

const userHelper      = require('../lib/util/user-helper');

const express         = require('express');
const tweetsRoutes    = express.Router();
const methodOverride  = require('method-override');
const app             = express();
const Chance          = require('chance');
const chance          = new Chance();

app.use(methodOverride('_method'));

module.exports = function(DataHelpers) {
  // requests all tweets in the collection and responds with the tweets
  tweetsRoutes.get('/tweets/', function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  // posts a tweet with a randomly generated user
  tweetsRoutes.post('/tweets/', function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: 0,
      id: chance.string(),
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send(tweet);
      }
    });
  });

  // adjusts tweet's 'like' property
  tweetsRoutes.post('/tweets/like/', function(req, res) {
    DataHelpers.updateLikes(req.body.id, req.body.likes, req.body.liked, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send('success');
      }
    });
  });

  return tweetsRoutes;
};