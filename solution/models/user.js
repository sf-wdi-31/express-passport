// @AUTH

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

var userSchema = new Schema({
  email: String,
  passwordDigest: String
});

// returns encrypted version of password
// call pattern: User.encrypt('some password')
userSchema.statics.encrypt = function(password) {
  return bcrypt.hashSync(password, salt);
};

// returns true if password argument matches stored digest
// returns false if not a match
// call pattern: user1.validPassword("user 1's password?!")
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
