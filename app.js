if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// console.log(process.env);

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const e = require('express');
const userRouter = require('./routes/user.js');

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl = process.env.ATLASDB_URL;



main()
.then(()=>{
    console.log("Connected to DB");
})
.catch(err =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter:24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true, // Mitigate XSS attacks
    },
};

// app.get('/', (req, res) => {
//     res.send("Hi, i'm root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // how to store a user in the session
passport.deserializeUser(User.deserializeUser());  // how to get a user out of the session


const originalAppUse = app.use.bind(app);
app.use = (...args) => {
    console.log("app.use called with:", args[0]);
    originalAppUse(...args);
};

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});




app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);



// const axios = require('axios');  // add this at the top with other requires

// app.get("/listings/:id", wrapAsync(async(req,res)=>{
//     const {id} = req.params;
//     const listing = await Listing.findById(id).populate('reviews'); // Populate reviews to include review details

//     // Call your Flask API for predicted price
//     let predictedPrice = null;
//     try {
//         const response = await axios.post('http://127.0.0.1:5000/predict', {
//             location: listing.location,
//             country: listing.country
//         });
//         predictedPrice = response.data.predicted_price;
//     } catch (error) {
//         console.error("Error fetching predicted price:", error.message);
//         predictedPrice = "N/A";
//     }

//     res.render("listings/show.ejs", { listing, predictedPrice });
// }));


// app.all("*", (req,res,next) => {
//     try{
//         // res.send("Page not found");
//     next(new ExpressError(404, "Page not found"));
//     } catch(err){
//         // console.log(err);
//         console.log(`Request: ${req.method} ${req.path}`);
//     }
    
// });
 
// app.use((err, req, res, next) => {
//     try{
//         // res.send("Something went wrong");
//     let {statusCode, message} = err;
//     console.error("Error occurred:", err);
//     // res.status(statusCode).send(message);
//     }catch(err){
//         // console.log(err);
//         console.log(`Request: ${req.method} ${req.path}`);
//     }
    
// });


// 404 handler
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

// // Error handler
// app.use((err, req, res, next) => {
//     const { statusCode = 500, message = "Something went wrong" } = err;
//     console.error("Error occurred:", err);
//     res.status(statusCode).send(message);
// });


app.listen(8080, () =>{
    console.log("Server is running on port 8080");
});