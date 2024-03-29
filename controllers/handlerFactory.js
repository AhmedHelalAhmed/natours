const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { NOT_FOUND, ON_CONTENT, OK, CREATED } = require('../enums/httpResponse');
const { SUCCESS_STATUS } = require('../enums/status');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (request, response, next) => {
    const doc = await Model.findByIdAndDelete(request.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', NOT_FOUND));
    }

    response.status(ON_CONTENT).json({
      status: SUCCESS_STATUS,
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (request, response, next) => {
    const doc = await Model.findByIdAndUpdate(request.params.id, request.body, {
      new: true, // this will return the updated document
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', NOT_FOUND));
    }

    response.status(OK).json({
      status: SUCCESS_STATUS,
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (request, response, next) => {
    const doc = await Model.create(request.body);
    response.status(CREATED).json({
      status: SUCCESS_STATUS,
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (request, response, next) => {
    let query = Model.findById(request.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', NOT_FOUND));
    }

    response.status(OK).json({
      status: SUCCESS_STATUS,
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (request, response, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (request.params.tourId) {
      filter = {
        tour: request.params.tourId,
      };
    }

    const features = new APIFeatures(Model.find(filter), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
    response.status(OK).json({
      status: SUCCESS_STATUS,
      data: {
        results: doc.length,
        data: doc,
      },
    });
  });
