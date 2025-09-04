const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing, validateReview } = require("../middleware.js");
const listingController = require('../controllers/listing.js');
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});

// combine index route and create route.
router
.route("/")
.get(wrapAsync(listingController.index)) 
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

// index route 


// get route for creating a new listing  ,, show route se upper rakhna hai
router.get("/new",isLoggedIn, listingController.renderNewForm); 

// show route
// router.get("/:id",wrapAsync(async(req,res)=>{
//     const {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/show.ejs", {listing});
// }));


// combine show, update and delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.distroyListing));


// post route for creating a new listing


// edit route
// router.get("/:id/edit", wrapAsync(async (req,res) =>{
//     const {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", {listing});
// }));
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));


// update route
// router.put("/:id", wrapAsync(async(req, res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/${id}`);
// }));


// Delete route


module.exports = router;