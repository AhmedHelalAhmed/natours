const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const OK = 200;
const ON_CONTENT = 204;
const CREATED = 201;
const NOT_FOUND = 404;

// middleware: required to make express work with body-parser
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

const getAllTours = (request, response) => {
  response.status(OK).json({
    // status maybe success - fail - error in jsend specification
    // https://github.com/AhmedHelalAhmed/jsend
    status: 'success',
    results: tours.length, // results not part of jsend specification
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

app.post('/api/v1/tours', createTour);
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
