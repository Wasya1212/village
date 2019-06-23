var express = require('express');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var statics = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var passport = require('./libs/passport');
var session = require('express-session');

module.exports = function() {
    var app = express();
    
    // parsing cookies
    app.use(cookieParser());
    
    // static foulder
    app.use(statics(path.join(__dirname, 'public')));
    
    // parse application/x-www-form-urlencoded 
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json 
    app.use(bodyParser.json());
    
    //express sessions
    var sessionStore = require('./libs/sessionStore');
    
    app.use(session({
        secret: 'akira1212',
        cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
        resave: true, 
        saveUninitialized: true,
        store: sessionStore
    }));
    
    // set engine
    app.set('views', __dirname + '/views');
    app.set('view engine', 'pug');
   
    // headers
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    // passport initialization
    app.use(passport.initialize());
    app.use(passport.session());
    
    return app;
}