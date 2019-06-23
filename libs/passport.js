var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//просто пару слів про функцію

passport.use(new LocalStrategy({ // використовуєш власну авторизацію
        usernameField: 'username',
        passwordField: 'password'
    },
    
    //
    function(username, password, done) {  // перевіряєш чи є користувач в базі, якщо ні то шлеш нахуй
        User.findUserByUsername(username, function(err, user) {
            if (err) console.error(err.message);
            if (!user) {
                console.log('no user');
                return done(null, false, {message: 'Uknown user'});
            }
            
            //
            
            User.comparePassword(password, user.password, function(err, isMath) { // розкодовуєш пароль
                if (err) console.error(err.message);
                if (isMath) {
                    console.log(user);
                    return done(null, user);
                } else {
                    console.log('no user pass');
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }
));



passport.serializeUser(function(user, done) { // якась хуйня хз просто має бути походи там чет з записом в сесію
  done(null, user.id);
});

passport.deserializeUser(function(id, done) { // ну а тут та сама хуйня, походу якась перевірка чи індексація користувача, хз
  User.findUserById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;