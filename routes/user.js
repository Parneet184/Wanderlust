// const express = require('express');
// const router = express.Router();
// const passport = require('passport');


// const User = require('../models/user.js');
// const wrapAsync = require('../utils/wrapAsync.js');
// const { saveRedirectUrl } = require('../middleware.js');

// const userController = require('../controllers/users.js');
// const user = require('../models/user.js');

// router.route("/signup")
// .get(userController.renderSignup)
// .post(wrapAsync(userController.signup));

// router.route("/login")
// .get(userController.renderLogin)
// .post(saveRedirectUrl, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login);

// router.get('/logout', userController.logout);

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get( userController.renderSignupForm)
    .post( userController.signUp);

router
    .route("/login")
    .get( wrapAsync(userController.renderLoginForm))
    .post( saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;
