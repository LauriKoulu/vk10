"use strict";

var LocalStrategy = require('passport-local').Strategy;

// user model
var User = require('../models/Users');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // serialize user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('local-login', new LocalStrategy({
        // we use email and password
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allow request to be passed
    },
    function(req, email, password, done) { 

		// find the user with right email
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if we get an error, return error
            if (err)
                return done(err);

            // if no user found
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is 

            // if password is invalid
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create 

            // return user if successful
            return done(null, user);
        });

    }));

	// local-signup
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        process.nextTick(function() {

        // pretty much the same as login. find user with email
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if error. return error
            if (err)
                return done(err);

            // check if user exists with given email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if no user found, create new user
                var newUser = new User();

                // set user data before saving model
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

};
