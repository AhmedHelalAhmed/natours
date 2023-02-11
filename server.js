const dotEnv = require('dotenv');
const mongoose = require('mongoose');
// must be on the top before any code execution
process.on('uncaughtException', (error) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(error);
  process.exit(1);
});

dotEnv.config({ path: './config.env' });
const DATABASE = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));
const app = require('./app');

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port ${process.env.PORT}...`);
});

process.on('unhandledRejection', (error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(error);
  // finished all the work running then shut-down
  server.close(() => {
    process.exit(1); //uncaught error
  });
});
