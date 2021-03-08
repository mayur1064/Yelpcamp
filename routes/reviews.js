const express = require('express')
const reviews = require('../controllers/reviews.js')
const { isLoggedIn ,validateReview, isReviewAuthor } = require('../middlewares.js')

const catchAsync = require('../utils/cathAsync');

const router = express.Router({mergeParams : true})


router.post('/',  isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId' ,isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;