const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

const { OK } = require('../enums/httpResponse');
const { SUCCESS_STATUS } = require('../enums/status');
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
exports.setTourUserIds = (request, response, next) => {
  // Allow nested routes
  if (!request.body.tour) {
    request.body.tour = request.params.tourId;
  }
  if (!request.body.user) {
    request.body.user = request.user.id;
  }
  next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
