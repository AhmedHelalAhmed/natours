const dotEnv = require('dotenv');
const mongoose = require('mongoose');

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

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port ${process.env.PORT}...`);
});
