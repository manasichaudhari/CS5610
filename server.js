var express = require('express');
var app = express();

// For Security and User management.
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(session({
    secret: process.env.SESSION_SECRET, //Store it in local env variables.
    resave: true,
    saveUninitialized: true
}));


// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));


app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// require("./assignment/app.js");
require("./project/app.js")(app);

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
