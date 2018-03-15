var mongoose = require('mongoose');
var Campgrounds= require('./models/campgrounds');
var Comment= require('./models/comments');



function seedsDB()
{
   /* Comment.create({
        author:"lallulal",
        txt:"wow! such a nice place."
        
    },function(err,comment)
    {
        //console.log(comment);
        if(!err)
        {
            Campgrounds.findOne({},function(err,found)
            {
                if(!err)
                {
                    found.comments.push(comment);
                    
                    found.save(function(err,saved)
                    {
                        if(!err)
                        console.log(saved);
                    });
                }
            });
        }
        
    
    });
    */
    
};


module.exports=seedsDB;