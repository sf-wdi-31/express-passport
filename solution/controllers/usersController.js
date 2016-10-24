// @AUTH

var db = require('../models');

// POST /api/users
function create(req, res){
  console.log('creating user', req.body);
  db.User.findOne({email: req.body.email}, function(err, user){
    if(user){
      console.log('email taken', user);
      res.status(500).send("Email is taken.");
    } else {
      console.log('creating');
      db.User.create(req.body, function(err, createdUser){
        if(createdUser) {
          res.json(createdUser);
        } else {
          res.status(500).json(err);
        }

      });
    }
  })
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
