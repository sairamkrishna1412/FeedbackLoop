exports.authGoogle = (req, res) => {
  res.send('Sent Google token');
};

exports.authGoogleCallback = (req, res) => {
  console.log('Google authentication completed!!');
  res.redirect('/');
};

exports.authFacebook = (req, res) => {
  res.send('Sent Facebook token');
};

exports.authFacebookCallback = (req, res) => {
  console.log('facebook callback triggered!');
  res.redirect('/');
  // res.send('Facebook authentication completed!!');
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
