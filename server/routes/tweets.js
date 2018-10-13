'use strict';

const userHelper      = require('../lib/util/user-helper');

const express         = require('express');
const tweetsRoutes    = express.Router();
const app             = express();
const Chance          = require('chance');
const chance          = new Chance();
const bcrypt          = require('bcrypt');
const jwt             = require('jsonwebtoken');
const bodyParser      = require('body-parser');
const cookieParser    = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

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
    DataHelpers.checkLoggedIn(req.body.token, function(err, response) {
      if (err) {
        res.status(400).json({error: err});
      } else {
        const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
        const tweet = {
          user: user,
          content: {
            text: req.body.text
          },
          created_at: Date.now(),
          likes: 0,
          id: chance.string(),
          token: '',
        };

        DataHelpers.saveTweet(tweet, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            res.status(201).send(tweet);
          }
        });
      }
    });
  });

  // adjusts tweet's 'like' property
  tweetsRoutes.post('/tweets/like/', function(req, res) {
    DataHelpers.checkLoggedIn(req.body.token, function(err, response) {
      if (err) {
        res.status(400).json({error: err});
      } else {
        const tweet = {
          id: req.body.id,
          likes: req.body.likes,
          liked: req.body.liked,
        };
        DataHelpers.updateLikes(tweet, (err) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            res.status(201).send('success');
          }
        });
      }
    });
  });

  // Login route
  tweetsRoutes.post('/login', function(req, res) {
    const JWTToken = jwt.sign({
      email: req.body.email,
      _id: req.body.id,
    },
    'supersecretestsecret',
    {
      expiresIn: 2*60*60*1000
    });
    const user = {
      email: req.body.email,
      password: req.body.password,
      token: JWTToken,
    };

    DataHelpers.login(user, (err, response) => {
      if (err) {
        res.status(500).send(response);
      } else {
        res.status(200).json({
          success: 'welcome to the JWT auth',
          token: JWTToken
        });
      }
    });
  });

  tweetsRoutes.post('/logout', function(req, res) {
    DataHelpers.logout(req.body.token, (err, response) => {
      if (err) {
        res.status(500).json({err: err});
      } else {
        res.status(200).json({response: response});
      }
    });
  });

  // registeration end point. takes username and password
  tweetsRoutes.post('/register', function(req, res) {
    const user = {
      id: chance.string(),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    };
    DataHelpers.register(user, (err, response) => {
      if (err) {
        res.send(false);
      } else {
        res.status(201).send(response);
      }
    });
  });

  return tweetsRoutes;
};