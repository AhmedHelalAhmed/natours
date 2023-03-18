const Tour = require('../models/tourModel');
const { OK, BAD_REQUEST } = require('../enums/httpResponse');
const catchAsync = require('../utils/catchAsync');
const { SUCCESS_STATUS } = require('../enums/status');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.checkIfTourExists = async (request, response, next, value) => {
  console.log(`Tour id is: ${value}`);
  next();
};

exports.checkCreateTourBody = (request, response, next) => {
  if (!request.body.name || !request.body.price) {
    console.log('in checkCreateTourBody');
  }
  next();
};

exports.aliasTopTours = (request, response, next) => {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.createTour = factory.createOne(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStatistics = catchAsync(async (request, response, next) => {
  const ASCENDING = 1;
  const VALUE_PER_EACH_RECORD = 1;
  const statistics = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: '$difficulty',
        // _id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: VALUE_PER_EACH_RECORD },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: ASCENDING },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  response.status(OK).json({
    status: SUCCESS_STATUS,
    data: {
      statistics,
    },
  });
});
// implement a function to calculate the busiest month of a given year.
// calculating how many tours start in each of the month of the given year.
exports.getMonthlyPlan = catchAsync(async (request, response, next) => {
  const DSCENDING = -1;
  const HIDE = 0;
  const VALUE_PER_EACH_RECORD = 1;
  const year = parseInt(request.params.year, 10); // 2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: VALUE_PER_EACH_RECORD },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: HIDE, //0: to remove 1: to show
      },
    },
    {
      $sort: { numTourStarts: DSCENDING }, // -1 descending
    },
    // {
    //   $limit: 12, //not needed actually in this case
    // },
  ]);

  response.status(OK).json({
    status: SUCCESS_STATUS,
    data: {
      plan,
    },
  });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (request, response, next) => {
  const { distance, latlng, unit } = request.params;
  const [lat, lng] = latlng.split(',');
  const THE_RADIUS_OF_THE_EARTH_IN_MILES = 3963.2;
  const THE_RADIUS_OF_THE_EARTH_IN_KILOMETRES = 6378.1;
  const radius =
    unit === 'mi'
      ? distance / THE_RADIUS_OF_THE_EARTH_IN_MILES
      : distance / THE_RADIUS_OF_THE_EARTH_IN_KILOMETRES; // change the distance to be in radians for mongodb to work on the query

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        BAD_REQUEST
      )
    );
  }

  // console.log(lat, lng, distance, unit);
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }, // we always put lng then lat as geo adjacent for some reason works like that
  });
  // we should add index to startLocation to make the query work
  response.status(OK).json({
    status: SUCCESS_STATUS,
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
