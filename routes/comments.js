var express= require('express');
var router= express.Router({mergeParams:true});
var Campgrounds=require('../models/campgrounds');
var Comments= require('../models/comments');
var isLoggedIn=require('../middlewares/loggedin');
var commentOwnership=require('../middlewares/commentownership');

//NEW COMMENT ROUTE
router.get('/new',isLoggedIn,function(req,res)
{
     Campgrounds.findById(req.params.id,function(err,found)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("./comments/new.ejs",{camp:found});
        }
        
    });
});

//CREATE COMMENT ROUTE
router.post('/',isLoggedIn,function(req,res)
{
   Campgrounds.findById(req.params.id,function(err,found)
   {
       if(!err)
       {
         Comments.create(req.body.comment,function(err,created)
         {
             if(!err)
             {
                 created.author.id=req.user._id;
                 created.author.username=req.user.username;
                 created.save();
                // console.log(created.author.username);
                found.comments.push(created);
              found.save(function(err,saved)
              {
                  if(!err)
                  {
                      req.flash("success","Added a New Comment");
                      res.redirect('/campgrounds/'+found._id);
                  }
              });
             }
         });
         
       }
   });

});

//EDIT COMMENT ROUTE
router.get('/:comment_id/edit',commentOwnership,function(req,res)
{
    
    Comments.findById(req.params.comment_id,function(err,foundComment)
    {
        if(!err)
        res.render('./comments/edit.ejs',{camp_id:req.params.id,comment:foundComment});
    });
 
});

//UPDATE COMMENT ROUTE
router.put('/:comment_id',commentOwnership,function(req,res)
{
    
  var camp_id=req.params.id;
  
  Comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment)
  {
      if(!err)
      {
           req.flash("success","Updated The Comment");
          res.redirect('/campgrounds/'+camp_id);
      }
  });
    
});

//DELETE COMMENT ROUTE
router.delete('/:comment_id',commentOwnership,function(req,res)
{
    var camp_id=req.params.id;
    
    Comments.findByIdAndRemove(req.params.comment_id,function(err,removedComment)
    {
        if(!err)
        {
             req.flash("success","Deleted The Comment");
            res.redirect('/campgrounds/'+camp_id);
        }
    });

});


module.exports= router;