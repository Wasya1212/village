var async = require('async');
//var cookie = require('cookie');
//var cookieParser = require('cookie-parser');
//var sessionStore = require('../libs/sessionStore');
var User = require('../models/user');

var online_users_sessions = [];
var rooms = [];

var socketio = require('socket.io');
var io;

// get (passport) session
function loadSession(sid, callback) {
    sessionStore.load(sid, function(err, session) {
        if (arguments.length == 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

module.exports = function(server) {
    io = socketio.listen(server);
    
    io.use(function(socket, next) {
        var handshakeData = socket.request;
        
        async.waterfall([
            function(callback) {
                // get parsed sid cookie
                handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

                // current session 
                var sidCookie = handshakeData.cookie['connect.sid'];
                // get clear sid
                var sid = cookieParser.signedCookie(sidCookie, 'AnoHana');
                
                loadSession(sid, callback);
            },
            function(session, callback) {
                if (!session) {
                    callback('session not found')
                }
                
                handshakeData.session = session;
                // session.passport - current user ID in DB
                loadUser(session.passport, callback);
            },
            function(user, callback) {
                if (!user) {
                    callback('user not found');
                }
                
                handshakeData.user = user;
                callback(null)
            }
        ], function(err) {
            if (err) {
                console.log(err);
                //return next(err);
            }
            
            //console.log(socket.request.user);
            next();
        });
    }); // !!!!!!!!!!!!!!!!!!!!!!!!! handle errors must
    
    io.on('connection', function(socket) {
        if (socket.request.user) {
            var userId = socket.request.user._id;
        
            joinRoom(socket, userId);
            assignGuestName(socket);
            handleMessageBroadcasting(socket);
            handleFriendshipRequestsBroadcasting(socket);
            handleClientDisconnection(socket);
        } else {
            socket.emit('session:reload');
        }
        
    });
    
    return io;
}

// on user connection
function assignGuestName(socket) {
    socket.broadcast.emit('new user');
}

function joinRoom(socket, room) {
    socket.join(room);
    console.log('New user: ' + socket.id);
}

// on user disconnection
function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {
        socket.broadcast.emit('disconnection');
        
        console.log('user disconnected: ' + socket.id);
    });
}