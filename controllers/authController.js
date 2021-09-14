exports.authGoogle = (req, res) => {
  res.send('auth token returned');
};

exports.authGoogleCallback = (req, res) => {
  res.send('done');
};

exports.logout = (req, res) => {
  req.logout();
  res.send(req.user);
};
