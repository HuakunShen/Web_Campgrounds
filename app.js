var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    seedDB = require('./seeds'),
    passport = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    passwords = require('./password'),
    MongoConnection = require('./server_util');


// send current user to every route



// mongodb+srv://huakun:<password>@mywebsitedb-h7m8y.mongodb.net/test?retryWrites=true&w=majority
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
const mongo_connection = new MongoConnection("mongodb+srv://huakun:" + passwords.mongodb_pwd + "@mywebsitedb-h7m8y.mongodb.net/", "?retryWrites=true&w=majority");
mongoose.connect(mongo_connection.connectionString("campground"), {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// seedDB();    // seed the database
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// passport config
app.use(require("express-session")({
    secret: "secret encode code random",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser((User.deserializeUser()));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// require routes from separate files
const commentRoutes = require("./routes/comments");
const campgroundsRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.listen(process.env.PORT || 3000, function () {
    console.log("Yelpcamp server starts!!!");
});

