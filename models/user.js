var bcrypt = require('bcrypt');
var mongoose = require('../libs/mongoose');

var UserSchema = mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.findUserByUsername = function(username, callback) {
    var query = {nickname: username};
    User.findOne(query, callback);
}

module.exports.findUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMath) {
         if (err) throw err;
        callback(null, isMath);
    });
}