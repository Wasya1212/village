var session = require('express-session');
var MongoStore = require('connect-mongo')(session),
    sessionStore = new MongoStore({ url: 'mongodb://wasya1212:wasya1212@ds341847.mlab.com:41847/village' });

module.exports = sessionStore;
