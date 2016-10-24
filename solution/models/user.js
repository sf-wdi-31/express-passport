// @AUTH

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  passwordDigest: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
