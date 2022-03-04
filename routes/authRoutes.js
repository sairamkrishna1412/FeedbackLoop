const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const passport = require('passport');
require('../services/passport');

/* google and facebook, details request middleware */
const googleOAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});
const facebookOAuth = passport.authenticate('facebook', {
  scope: ['email'],
});

/* google and facebook, callback middleware */
const googleOAuthCallback = passport.authenticate('google', {
  failureRedirect: '/login',
});
const facebookOAuthCallback = passport.authenticate('facebook', {
  failureRedirect: '/login',
});

/* google authentication routes */
router.get('/google', googleOAuth, authController.authGoogle);
router.get(
  '/google/callback',
  googleOAuthCallback,
  authController.authGoogleCallback
);

/* facebook authentication routes */
router.get('/facebook', facebookOAuth, authController.authFacebook);
router.get(
  '/facebook/callback',
  facebookOAuthCallback,
  authController.authFacebookCallback
);

/* logout route */
router.get('/logout', authController.logout);

module.exports = router;
