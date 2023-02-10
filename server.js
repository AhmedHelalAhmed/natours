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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, 'A tour must have a price'] },
});
const Tour = mongoose.model('Tour', tourSchema);
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

testTour
  .save()
  .then((document) => console.log(`Test tour saved! ${document}`))
  .catch((error) => {
    console.log('ERROR: ', error.message);
  });
app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port ${process.env.PORT}...`);
});
