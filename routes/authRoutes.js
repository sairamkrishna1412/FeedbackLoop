const express = require('express');
const authController = require('../controllers/authController');

const passport = require('passport');
require('../services/passport');
const googleOAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});
const facebookOAuth = passport.authenticate('facebook');

const router = express.Router();

router.get('/google', googleOAuth, authController.authGoogle);
router.get(
  '/google/callback',
  passport.authenticate('google'),
  authController.authGoogleCallback
);

router.get('/facebook', facebookOAuth, authController.authFacebook);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook'),
  authController.authFacebookCallback
);

router.get('/logout', authController.logout);

module.exports = router;
