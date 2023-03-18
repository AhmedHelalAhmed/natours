const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { NOT_FOUND, ON_CONTENT } = require('../enums/httpResponse');
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
