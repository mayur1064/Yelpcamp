const Campground = require('../models/campGround');
const Review = require('../models/review');


module.exports.createReview = async (req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    //console.log(review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Review Added Successfully')
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.deleteReview = async (req,res) => {
    const {id , reviewId} = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndUpdate(id,{$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted Successfully')
    res.redirect(`/campgrounds/${campground._id}`);

}