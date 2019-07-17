const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground"),
    Comment = require("../models/comment");
const middleware = require("../middleware");


// create a new comment
// if not logged in /authenticated, not allowed to add comments
// basically run the middleware function "isLoggedIn" first, if logged in, "isLoggedIn" will direct to "next"
// which is the callback following
// only prevent user from seeing this page (form to coshare mment), could use postman to send post request, have to prevent
// that
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground})
        }
    });
});

// post a comment
// if not logged in, even if a post request is sent (maybe not from the form from the route above), new comment
// is still prevented
router.post('/', middleware.isLoggedIn, (req, res) => {
    // find campground

    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", "Campground Not Found");
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully Added Comment");
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    });
});

// edit and update comments routes
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Campground Not Found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
            }
        })
    });

});
// execute update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updated_comment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;