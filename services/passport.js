const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = require('../models/userModel');
const keys = require('../config/keys');

passport.serializeUser((user, done) => {
  // console.log('serialize ran', user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // console.log('de-serialize ran', id);
  const user = await User.findById(id);
  done(null, user);
});

// console.developers.google.com
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async function (accessToken, refreshToken, profile, done) {
      const googleID = profile.id;
      const existingUser = await User.findOne({ googleID });
      if (!existingUser) {
        const newUser = await User.create({
          googleID,
          name: profile.displayName,
        });
        return done(null, newUser);
      }

      done(null, existingUser);
    }
  )
);

//Facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookClientID,
      clientSecret: keys.facebookClientSecret,
      callbackURL: '/auth/facebook/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      const facebookID = profile.id;
      const existingUser = await User.findOne({ facebookID });
      if (!existingUser) {
        const newUser = await User.create({
          facebookID,
          name: profile.displayName,
        });
        return done(null, newUser);
      }
      done(null, existingUser);
    }
  )
);
