// @AUTH

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var db = require('../models');

localStrat = new LocalStrategy({
    usernameField : 'email',        // we're using email instead of username
    passwordField : 'password',     // will be password from client side
    passReqToCallback : true        // allow access to request in verify callback
  }, verifyCallback);

function verifyCallback(req, email, password, done) {
  // find a user with this email
  db.User.findOne({ 'email' :  email }, function(err, user) {
    if(err) {   // some error in the server or db
      console.log('query error', err);
      return done(err, false);
    } else if(user){  // there already is a user with this email
      console.log('email in use');
      return done(null, false);
    } else { // no errors and email isn't taken - create user!
      var newUser = new db.User();
      newUser.email = email;
      newUser.passwordDigest = db.User.encrypt(password);
      newUser.save(function(err){
        if(err){
          console.log('save error', err);
          return done(err, false);
        }
        console.log('created user', newUser);
        return done(null, newUser);
      });
    }
  });
}



// below everything else in config/passport.js
module.exports = function(passport) {
  passport.use('local-signup', localStrat);

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
