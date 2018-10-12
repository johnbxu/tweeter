'use strict';

const userHelper      = require('../lib/util/user-helper');

const cookieParser = require('cookie-parser');
const bcrypt          = require('bcrypt');
const express         = require('express');
const tweetsRoutes    = express.Router();
const methodOverride  = require('method-override');
const app             = express();
const Chance          = require('chance');
const chance          = new Chance();
const session = require('express-session');
app.use(session({
  secret: 'zoe dog',
  resave: true,
  saveUninitialized: true,
}));
// const cookieSession   = require('cookie-session');
// app.use(cookieSession({
  // name: 'session',
  // keys: ['keydonut', 'keyeclair'],
  // maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }));

app.use(cookieParser());
app.use(methodOverride('_method'));

module.exports = function(DataHelpers) {



  tweetsRoutes.post('/login', function(req, res) {
    const user = {  // this should be hashed
      email: req.body.email,
      password: req.body.password,
    };
    // req.session.email = req.body.email;
    // console.log(req.session.email);
    // req.session.email = req.body.email;
    // console.log(req.session.email);
    DataHelpers.login(user, (err, response) => {
      if (err) {
        res.status(500).send(response);
      } else {
        // req.session.loggedIn = true;
        res.cookie('loggedIn', true);
        res.status(201).send(response);
        // req.session.loggedIn = true;
        // req.session.email = user.email;
        // const variables = {
        //   loggedIn: req.session.loggedIn,
        //   email: req.session.email,
        // };
        // res.render('index.html', variables);
      }
    });
  });

  tweetsRoutes.post('/logout', function(req, res) {
    res.cookie('loggedIn', false);
  });

  // registeration end point. takes username and password
  tweetsRoutes.post('/register', function(req, res) {
    const user = {  // this should be hashed
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    };
    DataHelpers.register(user, (err, response) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(201).send(response);
      }
    });
  });

  tweetsRoutes.get('/tweets/', function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post('/tweets/', function(req, res) {
    if (req.cookies.loggedIn === true) {
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
    } else {
      res.status(400).send('not logged in');
    }
  });

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