const User = require('../models/user.js');


module.exports.renderSignup = (req, res) => {
    // res.send("User Registration Page");
    res.render('users/signup.ejs');
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        } );
        // req.flash('success', 'Welcome to Wanderlust!');
        // res.redirect('/listings');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.renderLogin = (req, res) => {
    // res.send("User Login Page");
    res.render('users/login.ejs');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    // const redirectUrl = req.session.redirectUrl || '/listings';
    // delete req.session.redirectUrl;
    res.redirect(res.locals.redirectUrl || '/listings');
    
}

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }  
        req.flash('success', "Logged you out!");
        res.redirect('/listings');
    })
}