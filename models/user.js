var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin:{
        type: Boolean,
        default:false
    }
});

User.plugin(passportLocalMongoose); // it adds username and password by default and it done hashing as well

module.exports = mongoose.model('User', User);