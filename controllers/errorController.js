const AppError = require('../utils/appError');
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('../enums/httpResponse');
const { ERROR_STATUS } = require('../enums/status');

const handleCastErrorDB = (error) => {
  console.log('in handleCastErrorDB', error);
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, BAD_REQUEST);
};

const handleDuplicateFieldsDB = (error) => {
  const value = Object.values(error.keyValue)[0];
  console.log(error);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, BAD_REQUEST);
};
const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map(
    (errorItem) => errorItem.message
  );

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, BAD_REQUEST);
};

const sendErrorDev = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error, response) => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    response.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', error);

    // 2) Send generic message
    response.status(INTERNAL_SERVER_ERROR).json({
      status: ERROR_STATUS,
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (error, request, response, next) => {
  error.statusCode = error.statusCode || INTERNAL_SERVER_ERROR;
  error.status = error.status || ERROR_STATUS;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, response);
  } else if (process.env.NODE_ENV === 'production') {
    let userError = { ...error };

    // in case send wrong id to mongoDB
    if (userError.path === '_id') {
      userError = handleCastErrorDB(userError);
    }

    if (userError.code === 11000) {
      userError = handleDuplicateFieldsDB(userError);
    }

    if (userError._message === 'Validation failed') {
      userError = handleValidationErrorDB(userError);
    }
    sendErrorProd(userError, response);
  }
};
