class AppError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    this.options = options;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
