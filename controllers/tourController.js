const Tour = require('../models/tourModel');
const { OK } = require('../enums/httpResponse');
const catchAsync = require('../utils/catchAsync');
const { SUCCESS_STATUS } = require('../enums/status');
const factory = require('./handlerFactory');

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
