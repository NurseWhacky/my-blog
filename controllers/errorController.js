const AppError = require('../utils/appError');

// development error response
const sendErrResDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// production error response
const sendErrResProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(`ERROR! ${err}`);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
};

const duplicateFieldHandler = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const msg = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(msg, 400);
};

module.exports = (err, req, res, next) => {
  // status code or default (500)
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrResDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // destructuring err obj
    let error = { ...err };

    if (error.code === 11000) error = duplicateFieldHandler(error);

    sendErrResProd(error, res);
  }
};
