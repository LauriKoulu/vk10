var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var errorHandler = require('errorhandler');

//var indexRouter = require('./routes/index');

//conf isProduction variable
var isProduction = process.env.NODE_ENV === 'production';

var app = express();
var DBurl = require('./config/DBurl.js');

// setup mongoose. not needed anymore, using json server instead.
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(DBurl.url);
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// models and routes
// var Item = require('./models/ItemsModel'); //same as calling mongoose.model('Item', ItemsSchema)
require('./models/Users');
require('./config/passport');
app.use(require('./routes'));

// view engine setup. not really needed but whatever
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// router for the json database
//app.use('/api', jsonServer.router('db.json'));

app.use(cors());
app.use(require('morgan')('dev'));
//app.use(logger('dev'));
//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'somestupidsecret', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

// router. doesn't do anything right now since we are serving the page as static file
//app.use('/', indexRouter);

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});*/

if(!isProduction) {
  app.use(errorHandler());
}

//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});
/*
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
