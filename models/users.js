var mongoose  =require('mongoose');
var passportlocalmongoose=require('passport-local-mongoose');

var userSchema = new mongoose.Schema(
    {
        username: String,
        email:String,
        password:String, 
        resetPasswordToken:String,
        resetPasswordExpires:Date
    });

userSchema.plugin(passportlocalmongoose);

module.exports=mongoose.model('User',userSchema);