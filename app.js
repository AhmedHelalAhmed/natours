const express = require('express');
const app = express();
const port = 3000;
const OK = 200;
app.get('/', (request, response) => {
  response.status(OK).send('Hello from the server side!');
});

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
