// const express = require('express');
// const router = express.Router({mergeParams: true});
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const Listing = require('../models/listing.js');
// const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");
// const reviewController = require("../controllers/reviews.js");


// // REviews

// // POST route for creating a new review
// router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// // DELETE route for deleting a review
// router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.distroyReview));

// module.exports = router;

const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review');
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const reviewController = require("../controllers/reviews.js");
// REviews
// post route.
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;