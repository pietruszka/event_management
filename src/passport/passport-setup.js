const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const config = require('../data/config.js');
const User = require('../data/db').userModel;


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new FacebookStrategy({
    //options for FacebookStrategy
    'clientID' : config.facebookAuth.clientID,
    'clientSecret' : config.facebookAuth.clientSecret,
    'callbackURL' : config.facebookAuth.callbackURL
  }, (accessToken, refreshToken, profile, done) => {
    passport callback function
    check if user already exists in mongoDB
    User.findOne({'facebook.facebookId' : profile.id}).then((currentUser) => {
      if (currentUser) {
        //user already exists
        console.log('user is:', currentUser.facebook);
        done(null, currentUser);
      } else {
        //if not, create user in mongoDB
        new User({
          facebook : {
            facebookId : profile.id,
            fullname : profile.displayName
          }
        }).save().then((newUser) => {
          console.log('new user created: ' + newUser.facebook);
          done(null, newUser);
        });
      }
    });
  }
)
);
