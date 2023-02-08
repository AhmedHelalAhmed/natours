const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
const port = 3000;
const OK = 200;
const ON_CONTENT = 204;
const CREATED = 201;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
//1) middlewares

// middleware: required to make express work with body-parser
app.use(morgan('dev'));

app.use(express.json());
// global middleware
app.use((request, response, next) => {
  console.log('Hello from middleware side');
  next();
});

app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);
//2) route handlers
const getAllTours = (request, response) => {
  response.status(OK).json({
    // status maybe success - fail - error in jsend specification
    // https://github.com/AhmedHelalAhmed/jsend
    status: 'success',
    results: tours.length, // results not part of jsend specification.
    requestedAt: request.requestTime,
    data: {
      tours,
    },
  });
};
const createTour = (request, response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...request.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      if (error) {
        console.log(error.message);
      }
      response.status(CREATED).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const getTour = (request, response) => {
  const tour = tours.find((tour) => tour.id === parseInt(request.params.id));

  if (!tour) {
    response.status(NOT_FOUND).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  response.status(OK).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const updateTour = (request, response) => {
  const tour = tours.find((tour) => tour.id === parseInt(request.params.id));
  if (!tour) {
    response.status(NOT_FOUND).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  response.status(OK).json({
    status: 'success',
    data: {
      tour: '<updated tour here...>',
    },
  });
};

const deleteTour = (request, response) => {
  const tour = tours.find((tour) => tour.id === parseInt(request.params.id));
  if (!tour) {
    response.status(NOT_FOUND).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  response.status(ON_CONTENT).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
const createUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
const getUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
const updateUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};
const deleteUser = (request, response) => {
  response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined!',
  });
};

//3) routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
