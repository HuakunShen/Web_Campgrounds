// called index.js because, if require a directory without specifying the js file name,
// index.js is the default to be imported
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            // does the user own the campground
            if (err || !foundComment) {
                req.flash("error", "Comment Not Found");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You Don't Have Permission.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You Need to Login First For This Action");
        res.redirect("back");
    }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            // does the user own the campground
            if (err || !foundCampground) {
                req.flash("error", "Campground Not Found");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You Need to Login First For This Action");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You Need to Login First For This Action");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;