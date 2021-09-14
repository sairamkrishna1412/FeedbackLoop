const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/userModel');
const keys = require('../config/keys');

passport.serializeUser((user, done) => {
  console.log('serialize', user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
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
    },
    async function (accessToken, refreshToken, profile, done) {
      const googleID = profile.id;
      const existingUser = await User.findOne({ googleID });
      if (!existingUser) {
        const newUser = await User.create({
          googleID,
        });
        return done(null, newUser);
      }

      done(null, existingUser);
    }
  )
);
