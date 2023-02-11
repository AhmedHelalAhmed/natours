const Tour = require('../models/tourModel');
const {
  OK,
  CREATED,
  NOT_FOUND,
  ON_CONTENT,
  BAD_REQUEST,
} = require('../enums/httpResponse');
const APIFeatures = require('../utils/apiFeatures');

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

exports.getAllTours = async (request, response) => {
  try {
    const features = new APIFeatures(Tour.find(), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;
    response.status(OK).json({
      status: 'success',
      data: {
        results: tours.length,
        tours,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(NOT_FOUND).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.createTour = async (request, response) => {
  try {
    const newTour = await Tour.create(request.body);
    response.status(CREATED).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(BAD_REQUEST).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.getTour = async (request, response) => {
  try {
    const tour = await Tour.findById(request.params.id);
    response.status(OK).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(NOT_FOUND).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.updateTour = async (request, response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
      new: true, // this will return the updated document
      runValidators: true,
    });
    response.status(OK).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(NOT_FOUND).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteTour = async (request, response) => {
  try {
    await Tour.findByIdAndDelete(request.params.id);
    response.status(ON_CONTENT).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.log(error);
    response.status(NOT_FOUND).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getTourStatistics = async (req, res) => {
  try {
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

    res.status(OK).json({
      status: 'success',
      data: {
        statistics,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(NOT_FOUND).json({
      status: 'fail',
      message: error.message,
    });
  }
};
// implement a function to calculate the busiest month of a given year.
// calculating how many tours start in each of the month of the given year.
exports.getMonthlyPlan = async (request, response) => {
  try {
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
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(NOT_FOUND).json({
      status: 'fail',
      message: error.message,
    });
  }
};
