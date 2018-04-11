var express=require('express');
var router= express.Router();
var dotenv=require('dotenv');
var multer = require('multer');
var cloudinary = require('cloudinary');

dotenv.config();

var Campgrounds=require('../models/campgrounds');
var isLoggedIn=require('../middlewares/loggedin');
var campOwnership=require('../middlewares/campownership');

var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter });

cloudinary.config({
    cloud_name: 'dcllce5it',
    api_key: 121594475921245,
    api_secret: '6rzpk9r0FN7HgiTja3VR5vdMGVk'
});

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
router.post('/', isLoggedIn, upload.single('campground[image]'),function(req,res){
    
    cloudinary.uploader.upload(req.file.path, function (result) {
        // add cloudinary url for the image to the campground object under image property    
        req.body.campground.img = result.secure_url;
        // add author to campground
        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        }

        Campgrounds.create(req.body.campground, function (err, newone) {
            if (err)
                console.log(err);
            else {
               // console.log(newone);
                req.flash("success", "Created a new Campground");
                res.redirect('/campgrounds');
            }
        });
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
