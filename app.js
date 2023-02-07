const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const OK = 200;

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

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
