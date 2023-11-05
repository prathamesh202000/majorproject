
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Please Log in to continue!");
        return res.redirect("/login");   
    }
    next();
 };

module.exports.saveRedirectUrl=(req,res,next)=>{
   
   if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
   }
    
    next();
};

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    //console.log(res.locals);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing!");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
 


//validation middleware
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id, reviewId}=req.params;
    let review=await Review.findById(reviewId);
    //console.log(res.locals);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!");
        return res.redirect(`/listing/${id}`);
    }
    next();
};