const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const OK = 200;
const CREATED = 201;
const NOT_FOUND = 404;

app.use(express.json()); // middleware: required to make express work with body-parser

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

app.get('/api/v1/tours', (request, response) => {
  response.status(OK).json({
    // status maybe success - fail - error in jsend specification
    // https://github.com/AhmedHelalAhmed/jsend
    status: 'success',
    results: tours.length, // results not part of jsend specification
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (request, response) => {
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
});
app.post('/api/v1/tours', (request, response) => {
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
});
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
