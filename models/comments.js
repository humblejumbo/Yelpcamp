var mongoose= require('mongoose');
var User=require('./users');
var commentSchema= new mongoose.Schema(
    {
        txt:String,
        author:{
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            username:String
        }
    });
    
module.exports= mongoose.model("Comment",commentSchema);
    