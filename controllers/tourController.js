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

exports.getAllTours = async (request, response) => {
  try {
    const tours = await Tour.find();
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
