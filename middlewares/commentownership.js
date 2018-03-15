var Comments=require('../models/comments');

function commentOwnership(req,res,next)
{
    if(req.isAuthenticated())
    {
        Comments.findById(req.params.comment_id,function(err,foundComment)
        {
            if(!err)
            {
                if(foundComment.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                    {
                        req.flash("error","You don't have permission");
                        res.redirect("back");
                    }
            }
            
        });
    }
    else
    {
         req.flash("error","You need To Login First");
         res.redirect('/login');
    }
       
}

module.exports=commentOwnership;