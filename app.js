var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');

var router = require('./routes/routes');

var app = express();

var DB = require('./config/DBurl.js');
var url = DB.url;

// setup mongoose. not needed anymore, using json server instead.
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(url);
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./config/passport')(passport);

// view engine setup. not really needed but whatever
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// NOPE. using mlab for this
/*
// router for the json database
app.use('/api', jsonServer.router('db.json'));
*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public'))); //serve public folder

//passport
app.use(session({ secret: 'catsanddogsareanimals' })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // for passing messages

require('./routes/routes.js')(app, passport);
// router. doesn't do anything right now since we are serving the page as static file
//app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;