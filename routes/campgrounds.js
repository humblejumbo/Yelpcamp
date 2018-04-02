var express=require('express');
var router= express.Router();
var dotenv=require('dotenv');
dotenv.config();
var Campgrounds=require('../models/campgrounds');
var isLoggedIn=require('../middlewares/loggedin');
var campOwnership=require('../middlewares/campownership');

//INDEX ROUTE
router.get('/',function(req,res)
{
    Campgrounds.find({},function(err,findall)
    {
        if(err)
        console.log(err);
        else
        res.render("./campgrounds/campgrounds.ejs",{campgrounds:findall , currentUser:req.user});
    });
    
});

//NEW CAMPGROUND ROUTE
router.get('/new',isLoggedIn,function(req,res)
{

    res.render("./campgrounds/new.ejs");
});

//CREATE CAMPGROUND ROUTE
router.post('/',isLoggedIn,function(req,res){
    var obj={
        name:req.body.name,
        img:req.body.img,
        location:req.body.location,
        description:req.body.description,
        author:{
            id:req.user._id,
            username:req.user.username
        }
        
    };
    Campgrounds.create(obj,function(err,newone)
    {
        if(err)
        console.log(err);
        else
        {
           // console.log(newone);
            req.flash("success","Created a new Campground");
            res.redirect('/campgrounds');
        }
    });
    
});

//SHOW CAMPGROUND ROUTE
router.get('/:id',function(req,res){
    
    Campgrounds.findById(req.params.id).populate("comments").exec(function(err,item){
        if(err)
        req.flash("Campground Not Found");
        else
        {
            res.render('./campgrounds/show.ejs',{camp:item});
        }
    });
    
});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit',campOwnership,function(req,res)
{
    Campgrounds.findById(req.params.id,function(err,found)
    {
        if(err)
        console.log(err);
        else
        res.render('./campgrounds/edit.ejs',{camp:found});
    });   
  
});

//UPDATE CAMPGROUND ROUTE
router.put('/:id',campOwnership,function(req,res)
{
  Campgrounds.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updated)
  {
      if(err)
      console.log("error");
      else
      {
         // console.log("updated");
          req.flash("success","Updated The Campground");
          res.redirect('/campgrounds/'+updated._id);
      }
  });
});

//DELETE CAMPGROUND ROUTE
router.delete('/:id',campOwnership,function(req,res)
{
    Campgrounds.findByIdAndRemove(req.params.id,function(err,found)
    {
        if(err)
        console.log(err);
        else
        {
        // console.log("removed");
          req.flash("success","Deleted The Campground");
         res.redirect('/campgrounds');
        }
    });
});


module.exports = router;
