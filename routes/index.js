const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing");
});

// ===================
// Auth Routes
// ===================
router.get("/register", (req, res) => {
    res.render('register');
});

// handle sign up
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Registered, Welcome.");
                res.redirect("/campgrounds");
            })
        }
    })
});


// show login form
router.get("/login", (req, res) => {
    res.render("login");
});

// handle login
router.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
    req.flash("success", "Signed In");
});


// logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You are logged out");
    res.redirect("/campgrounds");
});

module.exports = router;