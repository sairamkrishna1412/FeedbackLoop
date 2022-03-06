module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Something went wrong, please try again!';

  console.log(err);
  return res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    // stack: err.stack,
  });
};
