module.exports = function (app, model) {

    var passport = require('passport');
    var bcrypt = require("bcrypt-nodejs");
    var LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use('project', new LocalStrategy(localStrategy));


    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


    var facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'emails', 'displayName', 'name']
    };

    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };

    app.post('/api/project/register', createUser);
    app.get('/api/project/user/:uid', findUserById);
    app.get('/api/project/user', findUserByCredentials);
    app.get('/api/project/username', findUserByUsername);
    app.delete('/api/project/user/:uid', deleteUser);
    app.put('/api/project/user/:uid', updateUser);
    app.put('/api/project/restaurant/favorite/:uid', addFavoriteRestaurant);
    app.put('/api/project/restaurant/favorite/delete/:uid', deleteFavoriteRestaurant);
    app.put('/api/project/follow/:uid', followUser);
    app.put('/api/project/unfollow/:uid', unFollowUser);
    app.post('/api/project/login', passport.authenticate('project'), login);
    app.post('/api/project/logout', logout);
    app.post('/api/project/registerUser', registerUser);
    app.get('/api/project/checkLoggedIn', loggedIn);
    app.get('/api/project/findCurrentLoggedInUser', findCurrentLoggedInUser);
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
        successRedirect: '/project/#!/user',
            failureRedirect: '/project/#!/login'
    }));
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/project/#!/user',
            failureRedirect: '/project/#!/login'
        }));
    app.post('/api/project/checkAdmin', checkAdmin);
    app.post('/api/project/checkManager', checkManager);
    app.get('/api/project/admin/users', findAllUsers);
    app.delete('/api/project/admin/user/:uid', removeUser);
    app.put('/api/project/admin/favorite/delete/:uid', removeFavorite);
    app.put('/api/project/admin/create/admin', makeAdmin);
    app.put('/api/project/admin/create/manager', makeManager);


    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));


    function makeAdmin(req, res) {
        var user = req.body;
            model
                .UserModel.makeAdmin(user._id)
                .then(function (user) {
                    res.send(user)
                }, function (err) {
                    res.sendStatus(500);
                })
    }

    function makeManager(req, res) {
        var user = req.body;
        model
            .UserModel.makeManager(user._id)
            .then(function (user) {
                res.send(user)
            }, function (err) {
                res.sendStatus(500);
            })
    }

    function removeFavorite(req, res) {

        var userId = req.params['uid'];
        var fav = req.body;

        if (req.user && req.user.roles == "ADMIN") {
            model.UserModel.removeFavorite(userId, fav)
                .then(function (user) {
                    res.send(user);
                }, function (err) {
                    res.sendStatus(500);
                })
        }
    }


    function removeUser(req, res) {
        var userId = req.params['uid'];

        if (req.user && req.user.roles == "ADMIN") {
            model.UserModel.removeUser(userId)
                .then(function (user) {
                    res.send(200);
                }, function (err) {
                    res.send(500);
                })
        } else {
            res.send(401);
        }

    }

    function findAllUsers(req, res) {
        if (req.user && req.user.roles) {
            model.UserModel.findAllUsers()
                .then(function (users) {
                    res.send(users);
                })
        } else {
            res.send(401);
        }

    }

    function checkAdmin(req, res) {
        res.send(req.isAuthenticated() && req.user.roles == "ADMIN" ? req.user : '0');
    }

    function checkManager(req, res) {
        res.send(req.isAuthenticated() && (req.user.roles == "MANAGER" || req.user.roles == "ADMIN") ? req.user : '0');
    }

    function findCurrentLoggedInUser(req, res) {
        res.send(req.user);
    }

    function loggedIn(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function registerUser(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        model.UserModel
            .createUser(user)
            .then(function (user) {
                    if (user) {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                }
            );

    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function facebookStrategy(token, refreshToken, profile, done) {

        model.UserModel
            .findUserByFacebookId(profile.id)
            .then(function (user) {
                if (user) {
                    return done(null, user);
                }
                else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newFacebookUser = {
                        username: emailParts[0] + '_facebook',
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: email,
                        facebook: {
                            id: profile.id,
                            token: token
                        }
                    };
                    return model.UserModel.createUser(newFacebookUser);
                }
            }, function (err) {
                return done(err);
            })
            .then(function (user) {
                if (user) {
                    return done(null, user);
                }
            }, function (err) {
                return done(err);
            });

    }

    //google strategy
    function googleStrategy(token, refreshToken, profile, done) {
        // console.log(profile);
        model.UserModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return model.UserModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function localStrategy(username, password, done) {

        model.UserModel.findUserByUsername(username)
            .then(function (user) {

                if(user && bcrypt.compareSync(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }, function (error) {
                if (error) {
                    return done(err);
                }
            });
    }


    function unFollowUser(req, res) {
        var userId = req.params['uid'];
        var user = req.body;

        model.UserModel.unFollowUser(userId, user)
            .then(function (newUser) {
                if (newUser) {
                    model.UserModel.removeFollowedByUser(userId, user)
                        .then(function (user) {

                        });
                }
                res.send(newUser);
            }, function (err) {
                res.sendStatus(500).send('Could not unfollow user');
            })
    }

    function followUser(req, res) {
        var userId = req.params['uid'];
        var user = req.body;

        model.UserModel.followUser(userId, user)
            .then(function (newUser) {

                if (newUser) {
                    model.UserModel.addFollowedByUser(userId, user)
                        .then(function (user) {
                        });
                }
                res.send(newUser);
            }, function (err) {
                res.sendStatus(500).send('Could not follow user');
            });

    }

    function deleteFavoriteRestaurant(req, res) {
        var userId = req.params['uid'];
        var restaurant = req.body;

        model.UserModel.deleteFavoriteRestaurant(userId, restaurant)
            .then(function (response) {
                if (response) {
                    res.send(response);
                } else {
                    res.sendStatus(500);
                }
            });
    }

    function addFavoriteRestaurant(req, res) {
        var restaurant = req.body;
        var userId = req.params['uid'];

        model.UserModel.addFavoriteRestaurant(userId, restaurant)
            .then(function (user) {

                if (user) {
                    res.send(user);
                } else {
                    res.sendStatus(500);
                }
            });
    }

    function updateUser(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        var userId = req.params['uid'];

        model
            .UserModel.updateUser(userId, user)
            .then(function (user) {
                if (user) {
                    res.send(user);
                } else {
                    res.sendStatus(500).send('Could not update the user.')
                }
            })
    }

    function deleteUser(req, res) {
        var userId = req.params['uid'];

        if (req.user && req.user._id == userId) {
            model.ReviewModel.removeReviewByUser(req.user.username)
                .then(function (response) {
                    model.UserModel.deleteUser(userId)
                        .then(function (user) {
                            res.sendStatus(200);
                        }, function (err) {
                            res.sendStatus(500).send('Could not delete. DB error.')
                        });
                });

        } else {
            res.send(401);
        }

    }

    function findUserByUsername(req, res) {
        var username = req.query.username;

        model.UserModel.findUserByUsername(username)
            .then(function (user) {
                res.send(user);
            })
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        model.UserModel.findUserByCredentials(username, password)
            .then(function (user) {
                if (user) {
                    res.send(user);
                } else {
                    res.sendStatus(404).send('No such credentials found');
                }

            })
    }

    function findUserById(req, res) {
        var userId = req.params['uid'];

        model.UserModel.findUserById(userId)
            .then(function (user) {
                if (user) {
                    res.send(user);
                } else {
                    res.sendStatus(404).send('No such user found');
                }
            })
    }

    function createUser(req, res) {
        var user = req.body;
        model.UserModel.createUser(user)
            .then(function (user) {
                if (user) {
                    res.send(user);
                } else {
                    res.sendStatus(500).send('Could not create user.')
                }
            })

    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model.UserModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

}