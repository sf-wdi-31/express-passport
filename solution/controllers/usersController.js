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
  db.Album.find({_id: req.params.userId}, function(err, user) {
    if(user){
      res.json(user);
    } else {
      res.status(500).send(err);
    }
  });
}

function logout(req, res){
  res.send('yay');
}

function login(req, res){
  res.send('yay');
}


module.exports = {
  create: create,
  show: show,
  logout: logout,
  login: login
}
