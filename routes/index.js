var express=require('express');
var router= express.Router();
var passport=require('passport');
var Users=require('../models/users');


router.get('/',function(req,res)
{
    res.render("landing.ejs");
});



router.get('/register',function(req,res)
{
    res.render('register.ejs');
});

router.post('/register',function(req,res)
{
    
   Users.register(new Users({username:req.body.username}),req.body.password,function(err,newuser)
   {
       if(err)
       {
           console.log(err);
           req.flash("error",err.message);
          return res.redirect('/register');
       }
       else
       {
           passport.authenticate('local')(req,res,function()
           {
               console.log(newuser);
               req.flash("success","Welcome to Yelpcamp "+newuser.username);
               res.redirect('/campgrounds');
           });
       }
       
   }); 
});

router.get('/login',function(req,res)
{
    res.render('login.ejs');
});

router.post('/login',passport.authenticate('local',{successRedirect:'/campgrounds',
                                                failureRedirect:'/login'}));


router.get('/logout',function(req,res)
{
    req.logout();
    req.flash("success","Successfully Logged Out!");
    res.redirect('/campgrounds');
});



module.exports=router;