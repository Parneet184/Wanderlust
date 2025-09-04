const Listing = require('../models/listing.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{ 
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews', populate:{path: "author"}}).populate("owner"); // Populate reviews to include review details

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    console.log("Listing found:", listing);
    res.render("listings/show.ejs", { listing});
}

module.exports.createListing = async(req,res)=>{
    // let {title, description, image, price, location, country} = req.body;
    // let listing = req.body.listing;
    // console.log("REQ.BODY >>>", req.body);
    let url = req.file.path;
    let filename = req.file.filename;

    let result = await listingSchema.validateAsync(req.body); // Validate the request body against the schema
    console.log("Validation result:", result);
    if(!req.body.listing) {
        throw new ExpressError(400,"Listing data is missing");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the currently logged-in user
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
}
// module.exports.createListing = async (req, res, next) => {
//     try {
//         // Validate request body
//         const result = await listingSchema.validateAsync(req.body);
//         console.log("Validation result:", result);

//         if (!req.body.listing) {
//             throw new ExpressError(400, "Listing data is missing");
//         }

//         // Extract Cloudinary image info
//         const { path: url, filename } = req.file;
//         console.log(url, "..", filename);

//         // Create new listing
//         const newListing = new Listing(req.body.listing);
//         newListing.owner = req.user._id;
//         newListing.image = { url, filename };

//         await newListing.save();

//         req.flash("success", "Successfully made a new listing");
//         res.redirect("/listings");
//     } catch (err) {
//         next(new ExpressError(400, err.message));
//     }
// };


module.exports.editListing = async (req, res, next) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
        }
        
        if (!listing) {
            return next(new ExpressError(404, "Listing not found"));
        }
        let originalImageURL = listing.image.url;
        originalImageURL = originalImageURL.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", { listing, originalImageURL});
    } catch (err) {
        return next(new ExpressError(500, "Internal server error"));
    }
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    console.log("PUT /:id called with id =", id);
    
    if (!id) {
        throw new Error("Missing ID in PUT route");
    }

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    

    req.flash("success", "Successfully updated the listing");   
    
    const redirectPath = `/listings/${id}`;
    console.log("Redirecting to:", redirectPath);
    res.redirect(redirectPath);
}

module.exports.distroyListing = async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing");
    res.redirect("/listings");
}
