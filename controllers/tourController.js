const {
  OK,
  CREATED,
  NOT_FOUND,
  ON_CONTENT,
  BAD_REQUEST,
} = require('../enums/httpResponse');
const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);

exports.checkIfTourExists = async (request, response, next, value) => {
  console.log(`Tour id is: ${value}`);
  const tour = tours.find((tour) => tour.id === parseInt(value));
  if (!tour) {
    return response.status(NOT_FOUND).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  request.tour = tour;
  next();
};

exports.checkCreateTourBody = (request, response, next) => {
  if (!request.body.name || !request.body.price) {
    return response.status(BAD_REQUEST).json({
      status: 'fail',
      error: 'Name and price are required',
    });
  }
  next();
};

exports.getAllTours = (request, response) => {
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
exports.createTour = (request, response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...request.body };
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
exports.getTour = (request, response) => {
  response.status(OK).json({
    status: 'success',
    data: {
      tour: request.tour,
    },
  });
};
exports.updateTour = (request, response) => {
  response.status(OK).json({
    status: 'success',
    data: {
      tour: '<updated tour here...>',
    },
  });
};

exports.deleteTour = (request, response) => {
  response.status(ON_CONTENT).json({
    status: 'success',
    data: null,
  });
};
