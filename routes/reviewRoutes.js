const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({
  mergeParams: true, // by default, each router only have access to the parameters of their specific routes,
  // and we need to get access to tour id comes in the url
});

// POST /tour/24fsd5k/reviews
// POST/reviews
router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
