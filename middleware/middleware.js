const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.isAuth = catchAsync(async (req, res, next) => {
  // console.log('ran 1');
  if (req.isAuthenticated()) {
    return next();
  }
  return next(new AppError(400, 'You are not logged in. Please log in first!'));
});
