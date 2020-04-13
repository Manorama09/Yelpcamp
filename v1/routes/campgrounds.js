var express=require("express");
var router =express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");
//INDEX
router.get("/",function(req,res){
    Campground.find({},function(err,allCamp){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/campgrounds",{campgrounds:allCamp});
    }
});
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
var name=req.body.name;
var image=req.body.image;
var desc=req.body.desc;

var author={
    id:req.user._id,
    username:req.user.username
};

var newCamp={name:name,image:image,desc:desc,author:author}
Campground.create( newCamp,function(err,camp)
    {if(err){
        console.log(err);
    }else{
        console.log(camp);
        res.redirect("/campgrounds");
    }
});
});

//NEW
router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//SHOW
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,found){
    if(err){
        console.log(err);
    }else{
        console.log(found);
        res.render("campgrounds/show",{campground:found});
    }
    });
});

//EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkOwnership, function(req, res){	
    Campground.findById(req.params.id, function(err, foundCampground){	
        res.render("campgrounds/edit", {campground: foundCampground});	
    });	
});

//UPDATE CAMPGROUND 
router.put("/:id",middleware.checkOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DESTROY CAMPGROUND
router.delete("/:id",middleware.checkOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err,found){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports =router;