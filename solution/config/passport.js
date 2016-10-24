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
      return done(err);
    } else if(user){  // there already is a user with this email
      return done(null, false, req.flash('error', 'Email already in use.'));
    } else { // no errors and email isn't taken - create user!
      var newUser = new db.User();
      newUser.email = email;
      newUser.passwordDigest = db.User.encrypt(password);
      newUser.save(function(err){
        if(err){
          return done(err);
        }
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
