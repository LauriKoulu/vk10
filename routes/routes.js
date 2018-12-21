var express = require('express');
var path = require('path');
var Item = require('../models/Items');

// controller imports
// var index_controller = require('../controllers/indexController'); // no use for this yet
module.exports = function(app, passport) {
	/* GET home page. */
	app.get('/', function(req, res) {
		 res.render('index', { user: req.user });
	});

	// items page
	app.get('/items', function(req, res) {
		 Item.find().exec(function (err, list_items) {
		 	if (err) {
		 		console.log(err);
		 	}
		 	res.format({
		 		'text/html': function() {
		 	res.render('items', {items_list: list_items});
		 		},
		 		'application/json': function() {
		 			res.json(list_items);
		 		},
		 		'default': function() {
		 			res.status(406).send('Not Acceptable');
		 		}
		 	});
		 });
	});

	// get login form
	app.get('/login', function(req, res) {

	    // render and pass data
	    res.render('login', { message: req.flash('loginMessage'), title: 'Login' }); 
	});

	// post login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// get sign-up form
	app.get('/signup', function(req, res) {

	    // render and pass data
	    res.render('signup', { message: req.flash('signupMessage'), title: 'Create account' });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// check for logins
function isLoggedIn(req, res, next) {

    // authentication check
    if (req.isAuthenticated())
        return next();

    // redirect if not authenticated successfully
    res.redirect('/');
}