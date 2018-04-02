//CAMPGROUND AUTHORISATION

var Campgrounds=require('../models/campgrounds');

function campOwnership(req,res,next)
{
 if(req.isAuthenticated())
    {
         Campgrounds.findById(req.params.id,function(err,found)
         {
                if(err)
                    console.log(err);
                else
                {
                    if(found.author.id.equals(req.user._id))
                        next();
                    else
                    {
                        req.flash("error","You don't have permission to do that");
                        res.redirect("back");
                    }
                }
        });
    
    }
    else
    {
        req.flash("error","You Need To Login First");
        res.redirect('/login');
    }
}

module.exports = campOwnership;
