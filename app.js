
var express                 =require('express');
var bodyparser              =require('body-parser');
var mongoose                =require('mongoose');
var passport                =require('passport');
var localstrategy           =require('passport-local');
var passportlocalmongoose   =require('passport-local-mongoose');
var methodoverride          =require('method-override');
var nodemailer              =require('nodemailer');
var flash                   =require('connect-flash');
var bcrypt                  =require('bcrypt-nodejs');
var async                   =require('async');
var crypto                  =require('crypto');
var dotenv                  =require('dotenv');
var cookieSession           =require('cookie-session');

var Campgrounds=require('./models/campgrounds');
var Comments=require('./models/comments');
var Users=require('./models/users');

var camproutes=require('./routes/campgrounds');
var commentroutes=require('./routes/comments');
var indexroutes=require('./routes/index');


var seedsDB=require('./seeds');
seedsDB();


var app=express();
dotenv.config();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname +'/public'));
app.use(methodoverride("_method"));
app.use(flash());
app.use(cookieSession({
    name: 'session',
    keys: ['key'],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }));
app.use(require('express-session')
    ({
        secret:"don't tell anyone",
        resave:false,
        saveUninitialized:false
    }));
app.use(passport.initialize());
app.use(passport.session());
//mongoose.connect("mongodb://localhost/Yelpcamp");
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://tyson:nigga@ds115219.mlab.com:15219/campy")

//PASSPORT CONFIG
passport.use(new localstrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


app.use(function(req,res,next)
{
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});


app.use('/campgrounds',camproutes);
app.use('/campgrounds/:id/comments',commentroutes);
app.use('/',indexroutes);


app.listen(3000,function(){
    console.log("THE YELPCAMP SERVER HAS STARTED");
});
