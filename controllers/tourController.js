const Tour = require('../models/tourModel');
const {
  OK,
  CREATED,
  NOT_FOUND,
  ON_CONTENT,
  BAD_REQUEST,
} = require('../enums/httpResponse');

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
    const filters = { ...request.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((paramName) => delete filters[paramName]);
    let queryString = JSON.stringify(filters);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    let query = Tour.find(JSON.parse(queryString));

    if (request.query.sort) {
      const sortBy = request.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    if (request.query.fields) {
      const fields = request.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); //exclude the field __v
    }

    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 10;
    const page = parseInt(request.query.page, 10) || DEFAULT_PAGE;
    const perPage = parseInt(request.query.limit, 10) || DEFAULT_LIMIT;
    const skip = (page - 1) * perPage;
    query = query.skip(skip).limit(perPage);

    if (request.query.page) {
      const numberOfTours = await Tour.countDocuments();
      if (skip >= numberOfTours) {
        throw new Error('Page number is out of bounds');
      }
    }

    const tours = await query;
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
