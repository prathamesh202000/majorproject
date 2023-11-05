const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");
const {saveRedirectUrl}=require("../middleware.js");
const {validateListing}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//index route //create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing ,wrapAsync(listingController.createListing));

router.route("/search")
.get(wrapAsync(listingController.searchedIndex));

router.route("/category/:searchedCategory")
.get(wrapAsync(listingController.categoryIndex));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route //update route //delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing ,wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destoryListing))

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));

module.exports=router;