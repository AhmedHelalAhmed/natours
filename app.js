const express = require('express');
const app = express();
const port = 3000;
const OK = 200;
app.get('/', (request, response) => {
  response.status(OK).json({
    message: 'Hello from the server side!',
    app: 'Natours',
  });
});

app.post('/', (request, response) => {
  response.status(OK).json({
    message: 'You can post to this endpoint...',
    app: 'Natours',
  });
});
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
