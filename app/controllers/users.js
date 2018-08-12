'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    users = require('../models/user'),
    User = mongoose.model('User'),
    async = require('async'),
    hbs = require('hbs'),
    fs = require('fs'),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    expressValidator = require('express-validator'),
    helperCTRL = require('./helper');
    
module.exports.iSocket = null;




/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};



/**
 * Edit user
 */
exports.editUser = function(req, res) {

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('first_name', 'You must enter a first name').notEmpty();
    req.assert('last_name', 'You must enter a last name').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }


    User.update({
            '_id': req.params.userId
        },
        req.body
    ).exec(function(err, result) {

        if (result) {

            req.session.user.first_name = req.body.first_name;
            req.session.user.last_name = req.body.last_name;
            req.session.user.image = req.body.image;
            req.session.user.isImageSynced = 0;

            return res.json({
                status: true,
                message: 'Your Profile has been updated successfully',
                user: req.session.user
            });
        }
        return res.json({
            status: false,
            message: 'Your Profile has been updated successfully',
            user: req.session.user
        });
    });
};



/**
 * Post user account active
 */
exports.activateUserAccount = function(req, res) {

    userService.getUserDataBy({
        '_id': req.params.token
    }, {
        isActivate: true
    }, function(err, result) {

        if (result && result.isActivate) {
            res.redirect('/?activated=1');
            return;
        }


        User.update({
            '_id': req.params.token
        }, {
            isActivate: true
        }).exec(function(err, result) {

            if (err) {

                res.json({
                    status: false
                });

                return res.redirect('/');
            }

            return res.redirect('/?activated=2');
        });
    });
}



/**
 * Show login form
 */
exports.signin = function(req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    res.redirect('#!/login');
};



/**
 * Logout
 */
exports.signout = function(req, res) {

    if (res.session && res.session.user) {
        res.session.user = undefined;
    }

    req.logout();

    req.session = null;
    res.redirect('/');
};



/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};



/**
 * Create user
 */
exports.create = function(req, res, next) {

    req.body.email = req.body.email.toLowerCase();
    req.body.syncedImages = { 'a': '' };
    req.body.isImageSynced = 0;

    var user = new User(req.body);

    user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('first_name', 'You must enter a firstname').notEmpty();
    req.assert('last_name', 'You must enter a lastname').notEmpty();
    req.assert('email', 'You must enter a valid email address').isEmail();
    req.assert('password', 'Password too').len(8, 20);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    user.roles = ['member'];

    user.save(function(err, userResponse) {

        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).json([{
                        msg: 'Username already taken',
                        param: 'username'
                    }]);
                    break;
                default:
                    var modelErrors = [];

                    if (err.errors) {

                        for (var x in err.errors) {
                            modelErrors.push({
                                param: x,
                                msg: err.errors[x].message,
                                value: err.errors[x].value
                            });
                        }

                        res.status(400).json(modelErrors);
                    }
            }

            return res.status(400);
        }

        var organizationsModel = mongoose.model('organizations');

        var organizationsModelInsert = new organizationsModel({
            name:  "My Organization",
            details:  "",
            creater_user_id: userResponse._id,
            teams: [{
                userId: userResponse._id,
                roleType: 1,
                createdAt: new Date()
            }]
        });

        organizationsModelInsert.save(function(err, result) {});


        // Add board member
        if (req.body.memberId) {

            if(req.body.type == '1') {
                organizationService.addMemberByPendingUserId(req.body.memberId, userResponse._id, function() {});
            } else {

                var boardPUserModel = mongoose.model('board_pending_users');

                boardPUserModel.findOne({
                    _id: req.body.memberId
                }).exec(function(err, boardMember) {

                    if ( err || !boardMember ) {
                        res.json({status: false, err: err});
                    }

                    boardPUserModel.update({ _id: req.body.memberId }, { user_id: userResponse._id }).exec(function(err, success) {
                        console.log("err, success >>>>>>", err, success);

                        var data = {
                            pending_user_id: req.body.memberId,
                            board_id: boardMember.board_id,
                            user_id: userResponse._id,
                        };

                        userService.boardInvitationService(data, function(result) {});
                    });
                });
            }
        }


        req.logIn(user, function(err) {

            if (err) return next(err);

            var mailOptions = {
                to: user.email,
                from: 'info@jumpstartfund.com',
                subject: 'Welcome to IdeaBoard, Active your account.'
            };

            fs.readFile(__dirname + '/../views/signup-user-activation.html', 'utf8', function(err, htmlData) {

                var template = hbs.compile(htmlData);
                var activationLink = 'http://' + req.headers.host + '/activation/' + user._id + '/link';
                console.log('activationLink > ', activationLink);

                var compiledHTML = template({
                    activationLink: activationLink
                });

                mailOptions.html = compiledHTML;
                helperCTRL.sendEmail(mailOptions);
            });


            return res.redirect('/');
        });
        res.status(200);
    });
};



/**
 * Email activation
 */
exports.emailActivision = function(req, res) {

    userService.getUserDataBy({
        '_id': req.body.id
    }, {}, function(err, data) {

        if (data.isActivate == false) {

            var mailOptions = {
                to: data.email,
                from: 'info@jumpstartfund.com',
                subject: 'Welcome to IdeaBoard, Active your account.'
            };

            fs.readFile(__dirname + '/../views/signup-user-activation.html', 'utf8', function(err, htmlData) {

                var template = hbs.compile(htmlData);
                var activationLink = 'http://' + req.headers.host + '/activation/' + data._id + '/link';

                var compiledHTML = template({
                    activationLink: activationLink
                });

                mailOptions.html = compiledHTML;
                helperCTRL.sendEmail(mailOptions);
            });
        }
    });
    res.json({
        status: false,
        message: 'Verification details has been sent successfully.',
    });
}



/**
 * Send User
 */
exports.me = function(req, res) {
    res.json(req.user || null);
};



/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {

    userService.getUserDataBy({
        '_id': id
    }, {}, function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));
        req.profile = user;
        next();
    });
};



/**
 * Change the password
 */
exports.changeUserPassword = function(req, res, next) {

    var _uId = '';

    if(req.session && req.session.user && req.session.user._id) {
        _uId = req.session.user._id;
    }


    userService.getUserDataBy({
        '_id': _uId
    }, {}, function(err, user) {
        if (err) {
            return res.status(400).json({
                msg: err
            });
        }
        if (!user) {
            return res.status(400).json({
                msg: 'Unknown user'
            });
        }
        if (!user.authenticate(req.body.userOldPassword)) {

            return res.status(400).json({
                msg: 'Old password invalid'
            });
        }

        req.assert('userNewPassword', 'New password must be between 8-20 characters long').len(8, 20);
        req.assert('userConfirmPassword', 'Passwords do not match').equals(req.body.userNewPassword);

        var errors = req.validationErrors();

        if (errors) {
            return res.status(400).json(errors[0]);
        }

        user.password = req.body.userNewPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function(err) {
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.send({
                    user: user,
                });
            });
        });
    });
};



/**
 * Resets the password
 */
exports.resetpassword = function(req, res, next) {

    userService.getUserDataBy({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, {}, function(err, user) {
        if (err) {
            return res.status(400).json({
                msg: err
            });
        }
        if (!user) {
            return res.status(400).json({
                msg: 'Token invalid or expired'
            });
        }
        req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
        req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
        var errors = req.validationErrors();
        if (errors) {
            return res.status(400).send(errors);
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function(err) {
            req.logIn(user, function(err) {
                if (err) return next(err);
                return res.send({
                    user: user
                });
            });
        });
    });
};



/**
 * Callback for forgot password link
 */
exports.forgotpassword = function(req, res, next) {

    async.waterfall([

            function(done) {

                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {

                userService.getUserDataBy({
                    $or: [{
                        email: req.body.text
                    }, {
                        username: req.body.text
                    }]
                }, {}, function(err, user) {
                    if (err || !user) return done(true);
                    done(err, user, token);
                });
            },
            function(user, token, done) {

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            },
            function(token, user, done) {

                var mailOptions = {
                    to: user.email,
                    from: 'info@jumpstartfund.com',
                    subject: 'Forgot password request'
                };

                fs.readFile(__dirname + '/../views/forgot-password.html', 'utf8', function(err, htmlData) {

                    var template = hbs.compile(htmlData);

                    var compiledHTML = template({
                        token: token,
                        host: req.headers.host
                    });

                    mailOptions.html = compiledHTML;
                    helperCTRL.sendEmail(mailOptions);
                });

                done(null, true);
            }
        ],
        function(err, status) {

            var response = {
                message: 'Mail successfully sent',
                status: 'success'
            };

            if (err) {
                response.message = 'User does not exist';
                response.status = 'danger';
            }

            res.json(response);
        }
    );
};
