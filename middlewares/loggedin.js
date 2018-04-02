//CHECK IF USER IS LOGGED IN
function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
        req.flash('error',"You First Need To Login");
        res.redirect('/login');
    }
}

module.exports = isLoggedIn;


