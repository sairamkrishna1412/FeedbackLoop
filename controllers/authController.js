exports.authGoogle = (req, res) => {
  res.send('Sent Google token');
};

exports.authGoogleCallback = (req, res) => {
  res.send('Google authentication completed!!');
};

exports.authFacebook = (req, res) => {
  res.send('Sent Facebook token');
};

exports.authFacebookCallback = (req, res) => {
  console.log('facebook callback triggered!');
  res.send('Facebook authentication completed!!');
};

exports.logout = (req, res) => {
  req.logout();
  res.send(req.user);
};
