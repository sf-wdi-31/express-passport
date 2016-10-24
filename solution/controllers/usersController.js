// @AUTH

var db = require('../models');
var passport = require('passport');

// POST /api/users
function create(req, res){
  console.log('creating user', req.body);
  var signupAttempt = passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/'
  });
  return signupAttempt(req, res);
}

// GET /api/users/:userId
function show(req, res) {
  db.User.find({_id: req.params.userId}, function(err, user) {
    if(user){
      res.json(user);
    } else {
      res.status(500).send(err);
    }
  });
}


function login(req, res){
  var loginAttempt = passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/'
  });
  return loginAttempt(req,res);
}

function logout(req, res){
  console.log('logging out', req.user);
  req.logout();
  console.log('logged out', req.user);
  res.redirect('/');
}

module.exports = {
  create: create,
  show: show,
  logout: logout,
  login: login
}
