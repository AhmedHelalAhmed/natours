const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

// middleware: required to make express work with body-parser
app.use(morgan('dev'));
app.use(express.json());
app.use((request, response, next) => {
  console.log('Hello from middleware side');
  next();
});
app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
