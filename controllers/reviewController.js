const Review = require('../models/reviewModel');
const {
  INTERNAL_SERVER_ERROR,
  ON_CONTENT,
  BAD_REQUEST,
  OK,
  CREATED,
} = require('../enums/httpResponse');
const { ERROR_STATUS, SUCCESS_STATUS } = require('../enums/status');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(OK).json({
    status: SUCCESS_STATUS,
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (request, response, next) => {
  const newReview = await Review.create(request.body);
  response.status(CREATED).json({
    status: SUCCESS_STATUS,
    data: {
      review: newReview,
    },
  });
});
