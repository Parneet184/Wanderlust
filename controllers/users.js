const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// module.exports.signUp = async (req, res) => {
//     try {
//         let { username, email, password } = req.body;
//         if (!username || !email || !password) {
//             req.flash("error", "All fields are required.");
//             return res.redirect("/signup");
//         }
//         username = username.trim().toLowerCase();
//         const newUser = new User({ email, username });
//         const registeredUser = await User.register(newUser, password);
//         req.login(registeredUser, (err) => {
//             if (err) {
//                 return next(err);
//             }
//             req.flash("success", "Welcome to Wonderlust!");
//             res.redirect("/listings");
//         });

//     } catch (err) {
//         console.error(err);
//         req.flash("error", err.message);
//         res.redirect("/signup");
//     }
// };
module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        if (!username || !email || !password) {
            req.flash("error", "All fields are required.");
            return res.redirect("/signup");
        }

        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();

        console.log("Signup request:", { username, email });

        const newUser = new User({ email, username });
        console.log("New User (before save):", newUser);

        const registeredUser = await User.register(newUser, password);
        console.log("User successfully registered:", registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Login after signup failed:", err);
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (err) {
        console.error("Signup error:", err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = async (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
        req.flash("success", "Welcome back!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};