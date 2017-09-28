"use strict";

var express = require("express");
var router = express.Router();
var User = require("./models.users");
var jwt = require('jsonwebtoken');
var configs = require('./configs.misc');
var bcrypt = require('bcrypt');

router.post('/register', function (req, res, next) {

    let newUser = new User({
        user_name: req.body.username,
        password_hash: '',
        real_name: req.body.realname,
        email: req.body.email
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash( req.body.password, salt, (err, hash) => {
            if(err) throw err;
            
            newUser.password_hash = hash;

            User.addUser(newUser, (err, user) => {
                if (err) 
                {
                    res.json({success: false,err: err});
                } 
                else 
                {
                    if(user) 
                    {
                        var token = jwt.sign({data: user}, req.app.get('superSecret'), { expiresIn: 60*60*24 });
                        res.json({
                            success: true, 
                            userid: user._id,
                            username: user.user_name,
                            userrealname: user.real_name,
                            useremail: user.email,
                            token: token
                        });
                    }
                    else
                    {
                        res.json({success: false});
                    }
                }
            })
        })
    })

});

router.post('/authenticate', function (req, res, next) {

    const username = req.body.username;

    if( User.isStringEmpty(username) )
    {
        return res.json({
            success: false,
            msg: 'no username'
        });
    }

    const password = req.body.password;

    if( User.isStringEmpty(password) )
    {
        return res.json({
            success: false,
            msg: 'no password'
        });
    }

    User.getUserByUsername(username, (err, user) => {
        
        if (err) throw err;
        
        if (!user) {
            return res.json({
                success: false,
                msg: 'User not found.'
            });
        }
    
        bcrypt.compare( password, user.password_hash, (err, isMatch) => {

            if (err) throw err;

            if (!isMatch) {
                res.json({
                    success: false,
                    msg: 'Wrong password.'
                });
                return;
            }

            // log user in. create our token.
            var token = jwt.sign({data: user}, req.app.get('superSecret'), { expiresIn: 60*60*24 });

            // return user and token.
            res.json({
                success: true,
                userid: user._id,
                username: user.user_name,
                userrealname: user.real_name,
                useremail: user.email,
                token: token
            })

        });
    })

});

//router.post('/isauthenticated', function (req, res, next) {
router.post('/isauthenticated', function (req, res, next) {

    // passport.authenticate('jwt', {session: false})
    if( User.isAuthenticated(req) === false )
    {
        return res.json({noauth:true, success: false, msg: "Unauthorized"});
    }
    else
    {
        return res.json({success: true});
    }

});

router.post('/exists', function (req, res, next) {
    const username = req.body.username;
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({
                success: true,
                username: username
            });
        } else {
            return res.json({
                success: false
            });
        }
    });
});

// export this router
module.exports = router;
