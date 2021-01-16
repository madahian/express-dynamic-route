const error = require('../util/errorCreator');

const handleInvalidJWT = () => {
  return new error(
    'Authorization failed! Provide a valid token then try again...',
    401
  );
};

const handleDuplicateError = (err) => {
  return new error('Duplicate error, data already exists!', 400);
};

const handleJWTExpired = () => {
  return new error('Authorization failed! Please login again...', 401);
};

const handleUndefinedBindings = () => {
  return new error('Invalid data binding...', 400);
};

const handleNoDefaultData = (err) => {
  return new error(
    'Make sure to provide required properties in the request body.',
    400
  );
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational === true) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log error for developers
    console.error(
      `>> 💥 Server-Side Error Happend, request body: ${req.body}, URL: ${req.url} \n`,
      err
    );
    // Send something to the users
    res.status(500).json({
      status: 'error',
      message:
        'Something really wrong happend! Please try again after a while...',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.status === 'validationError') {
    return res.status(422).json({
      status: 'error',
      errors: err.errors,
      message: 'An error has been occurred during validating the data request.',
    });
  }

  if (process.env.NODE_ENV === 'development') {
    // Send error for development
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Send error for production
    if (err.name === 'JsonWebTokenError') err = handleInvalidJWT();
    if (err.name === 'TokenExpiredError') err = handleJWTExpired();
    if (err.code === 'ER_DUP_ENTRY') err = handleDuplicateError(err);
    if (err.message.startsWith('Undefined binding(s)'))
      err = handleUndefinedBindings(err);
    if (err.code === 'ER_NO_DEFAULT_FOR_FIELD') err = handleNoDefaultData(err);

    sendErrorProd(err, req, res);
  }
};
