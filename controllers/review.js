const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async (req,res)=>{
    let {id}=req.params;
    let review= new Review(req.body.review);
    let listing= await Listing.findById(id);
    review.author=req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","Review Submitted successfully!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyReview=async (req,res)=>{
    let {id, reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success","Review Deleted successfully!");
    res.redirect(`/listing/${id}`);
};
