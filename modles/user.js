/**
 * Created by Administrator on 2015/3/28 0028.
 */
var mongoose = require('./db');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
    name: String,
    password: String,
    email: String,
    face: String,
    avatar: String
});

var UserModel = mongoose.model('users', UserSchema,'users');

function User(user) {
    this.face = '';
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

module.exports = User;

User.prototype.save = function (callback) {
    //要存入数据库的用户
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
        avatar = "http://1.gravatar.com/avatar/" + email_MD5 + "?s=50";

    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        avatar: avatar,
        face: this.face
    };

    var newUser = new UserModel(user);
    newUser.save(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    })
}

User.get = function (name, callback) {
    UserModel.findOne({name: name}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    })
}

User.updateInfo = function (id, users, callback) {
    var user = users;

    if (user.email) {

        var md5 = crypto.createHash('md5'),
            email_MD5 = md5.update(user.email.toLowerCase()).digest('hex'),
            avatar = "http://1.gravatar.com/avatar/" + email_MD5 + "?s=50";

        user.avatar = avatar;

    }
    UserModel.findByIdAndUpdate(id, {$set: user}, function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    })
    
}