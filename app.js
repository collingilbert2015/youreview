//express require.
var express = require('express');
var path = require('path');
var app = express();
var routes = require('./routes')
var bootstrap = require("express-bootstrap-service");

//requres for database authentication
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Other dependencies
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Pass views and make sure they're pug.
app.set('view engine', 'pug');

// pull in user file
var users = require('./routes/users');

//set local. I can now pass title name.
app.locals.siteTitle = 'YouReview';
app.use(bootstrap.serve);

//middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// provides the schema to be given to passport
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));

//serializeUser/deserializeUser for implmenting sessions in passport
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/', routes);

//handle promise error
mongoose.Promise = global.Promise;
//connects to db
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



app.listen(3000, function() {
  console.log('Seems to be working...');
});
