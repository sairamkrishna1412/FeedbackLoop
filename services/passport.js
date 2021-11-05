const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = require('../models/userModel');
const keys = require('../config/keys');

passport.serializeUser((user, done) => {
  console.log('serialize ran', user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('de-serialize ran', id);
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
      // console.log(profile);
      const googleID = profile.id;
      const email = profile.emails[0].value;
      let existingUser = await User.findOne({ email });

      if (!existingUser) {
        const newUser = await User.create({
          email,
          name: profile.displayName,
          oAuth: 'Google',
          googleID,
        });
        return done(null, newUser);
      }

      if (!existingUser.googleID) {
        existingUser.googleID = googleID;
        await existingUser.save();
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
      profileFields: ['id', 'email', 'displayName', 'photos', 'gender'],
    },
    async function (accessToken, refreshToken, profile, done) {
      // console.log(profile);
      const facebookID = profile.id;
      let existingUser;
      let email;
      if (
        profile.hasOwnProperty('emails') &&
        profile.emails !== undefined &&
        profile.emails.length
      ) {
        email = profile.emails[0].value;
        existingUser = await User.findOne({ email });
      } else if (
        profile._json.hasOwnProperty('email') &&
        profile._json.email.length
      ) {
        existingUser = await User.findOne({ email });
      }

      if (!existingUser) {
        existingUser = await User.findOne({ facebookID });
      }
      if (!existingUser) {
        const newUser = await User.create({
          email,
          name: profile.displayName,
          oAuth: 'Facebook',
          facebookID,
        });
        return done(null, newUser);
      }
      done(null, existingUser);
    }
  )
);
