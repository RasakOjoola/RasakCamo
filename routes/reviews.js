const express = require('express')
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utility/catchAsync');
const { reviewSchema } = require('../schemas.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const review = require('../controllers/reviewController')


router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview))

module.exports = router
