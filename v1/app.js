var express     =require("express");
var app         =express();
var bodyParser  = require ("body-parser");
var mongoose    = require("mongoose");
var Campground  =require("./models/campground");
var Comment     =require("./models/comment");
var seedDB      =require("./seeds");
var passport    =require("passport");
var local       =require("passport-local");
var User        =require("./models/user");
var methodOverride=require("method-override");
var flash       =require("connect-flash");

//Requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true })
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public/"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret:"Secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error= req.flash("error");
    res.locals.success =req.flash("success");
    next();
    });

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(3000,function(){
    console.log("Server started");
});