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
  let filter = {};
  if (req.params.tourId) {
    filter = {
      tour: req.params.tourId,
    };
  }
  const reviews = await Review.find(filter);
  res.status(OK).json({
    status: SUCCESS_STATUS,
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (request, response, next) => {
  // Allow nested routes
  if (!request.body.tour) {
    request.body.tour = request.params.tourId;
  }
  if (!request.body.user) {
    request.body.user = request.user.id;
  }
  const newReview = await Review.create(request.body);
  response.status(CREATED).json({
    status: SUCCESS_STATUS,
    data: {
      review: newReview,
    },
  });
});
