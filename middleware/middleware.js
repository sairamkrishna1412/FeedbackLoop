exports.isAuth = (req, res, next) => {
  console.log('ran 1');
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(400).json({
    success: false,
    message: 'You are not logged in. Please log in first!',
  });
};
