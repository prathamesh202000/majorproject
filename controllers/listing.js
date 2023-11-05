const Listing=require("../models/listing");
const { all } = require("../routes/listing");

module.exports.index=async (req,res)=>{
    let allListings=await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    
};

module.exports.searchedIndex=async (req,res)=>{
    let searchedDestination=req.query.searchedDestination;
   
    let allListings=await Listing.find({location:{$regex:`${searchedDestination}`, $options:'i'}});
    let countryListings=await Listing.find({country:{$regex:`${searchedDestination}`, $options:'i'}});
    countryListings.forEach(list=>{
        if(!allListings.includes(list)){
            allListings.push(list);
        }
    });
    
        res.render("listings/index.ejs",{allListings});
    
};

module.exports.categoryIndex=async (req,res)=>{
    let {searchedCategory}=req.params;
    let allListings=await Listing.find({category:`${searchedCategory}`});
    
        res.render("listings/index.ejs",{allListings});
    
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");    
};

module.exports.createListing=async (req,res, next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let listing=new Listing(req.body.listing);
    listing.owner=req.user._id;
    listing.image={url, filename};
    await listing.save();
    req.flash("success","New Listing Created successfully!");
    res.redirect("/listing"); 
};

module.exports.editForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Lisiting You want to edit does not exist!");
        res.redirect("/listing");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_250");
    
        res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Lisiting You want to see does not exist!");
        res.redirect("/listing");
    }    
    res.render("listings/show.ejs",{listing});
};

module.exports.destoryListing=async (req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted successfully!");
        res.redirect(`/listing`);
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url, filename};
    await listing.save();
    }

    req.flash("success","Listing Updated successfully!");
        res.redirect(`/listing/${id}`);
};