const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { NOT_FOUND, ON_CONTENT, OK, CREATED } = require('../enums/httpResponse');
const { SUCCESS_STATUS } = require('../enums/status');

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
