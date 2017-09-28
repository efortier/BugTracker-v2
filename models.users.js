
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const configs = require('./configs.misc');

const userSchema = mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    password_hash: {
        type: String,
        required: true
    },
    real_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
    },  {
  collection:'users_v2'
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function (id, callback) {
    const query = {
        _id: id
    };
    // console.log('Getting user by id: ');
    // console.log(query);
    User.findOne(query, callback);
}

module.exports.getUserByUsername = function (userName, callback) {
    const query = {
        user_name: userName
    };
    User.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback) {
    newUser.save(callback);
}

isStringEmpty = function(str) {
    if ( str === null ) return true;
    if ( str === undefined ) return true;
    if ( str.length === 0 ) return true;
    return false;
}
module.exports.isStringEmpty = isStringEmpty;

module.exports.comparePassword = function (enteredPassword, userPassword, callback) {
    var res = isStringEmpty(enteredPassword) || isStringEmpty(userPassword);
    callback(null, res === false && enteredPassword.localeCompare(userPassword) == 0);
}

module.exports.comparePasswordToHash = function (enteredPassword, hash, callback) {
    var res = isStringEmpty(enteredPassword) || isStringEmpty(hash);
    if( res = true )
    {
        callback(null, false);
    } else {
        bcrypt.compare( enteredPassword, hash, (err, IsMatch)=> {
            if(err) throw err;
            callback(null, IsMatch);
        });
    }
};

module.exports.validateUser = function (user) {
    return (user.active == true);
};

function getToken(headers) {
    if(headers && headers.authorization) {
        return headers.authorization;
    } else {
        return null;
    }
};

module.exports.isAuthenticated = function(req) {
    
    var token = getToken(req.headers);
    if(!token) return false;
    if(token === undefined) return false;
    if(token.length === 0) return false;

    var decode = jwt.decode(token, configs.tokenSecret);
    if(!decode) return false;

    const userid = decode.data._id;
    if(!userid) return false;

    User.getUserById(userid, function(err, user) {
        if(err) throw err;
        if(!user) return false;
        return true;
    });

};