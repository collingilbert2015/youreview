'use strict';

var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

// Routes
router.get('/', function(req, res) {
  res.render('index', { user : req.user } );
});


router.get('/documentation', function(req, res) {
  res.render('documents');
});


//serve register
router.get('/register', function(req, res) {
  res.render('register', { });
});

//registrations from passport
router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }),
    req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});


//Login routes and authentications
router.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});


//logs user out and redirects home
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

//test, # check
router.get('/ping', function(req, res) {
  res.status(200).send("test!");
});

// Exports
module.exports = router;
