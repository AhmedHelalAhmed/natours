const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const { NOT_FOUND } = require('./enums/httpResponse');

const app = express();

// middleware: required to make express work with body-parser
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (request, response, next) => {
  next(
    new AppError(`Can't find ${request.originalUrl} on this server!`, NOT_FOUND)
  );
});

app.use(globalErrorHandler);

module.exports = app;
