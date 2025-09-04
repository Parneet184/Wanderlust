const Review = require("../models/review");
const Listing = require("../models/listing");



module.exports.createReview = async (req, res) => {
    // const { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully added a new review");
    res.redirect(`/listings/${req.params.id}`);
    // res.send("Review added successfully");
    console.log("New review added:", newReview);
}

module.exports.distroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findById(id);

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Successfully deleted a review");
    
    res.redirect(`/listings/${id}`);
}