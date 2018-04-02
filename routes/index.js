var express=require('express');
var router= express.Router();
var passport=require('passport');
var bcrypt=require('bcrypt-nodejs');
var nodemailer=require('nodemailer');
var async=require('async');
var crypto=require('crypto');
var dotenv=require('dotenv');
var Users=require('../models/users');
dotenv.config();

//LANDING ROUTE
router.get('/',function(req,res)
{
    res.render("landing.ejs");
});


//SIGNUP FORM ROUTE
router.get('/register',function(req,res)
{
    res.render('register.ejs');
});

//SIGNUP ROUTE
router.post('/register',function(req,res)
{
  Users.register(new Users({username:req.body.username,email:req.body.email}),req.body.password,function(err,newuser)
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
            //console.log(newuser);
            req.flash("success","Welcome to Yelpcamp "+newuser.username);
            res.redirect('/campgrounds');
          });
       }
       
   }); 
});

//LOGIN FORM ROUTE
router.get('/login',function(req,res)
{
    res.render('login.ejs');
});

//LOGIN ROUTE
router.post('/login',function(req,res)
{ 
  passport.authenticate('local',{successRedirect:'/campgrounds',
                                                failureRedirect:'/login',
                                                failureFlash:'Login Failed! Username or password is incorrect',
                                                successFlash:'Good To See You Again '+ req.body.username})(req,res);
});

//LOGOUT ROUTE
router.get('/logout',function(req,res)
{
    req.logout();
    req.flash("success","Successfully Logged Out!");
    res.redirect('/campgrounds');
});

//FORGET PASSWORD FORM ROUTE
router.get('/forget',function(req,res)
{
    res.render('forget.ejs');
});

//FORGET PASSWORD LOGIC AND MAIL SENDING
router.post('/forget', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        Users.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forget');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 360000; 
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport( {
          service: 'Gmail',
          auth: {
            user: 'imsg895@gmail.com',
            pass: process.env.epassword //'Shubham@46'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'imsg895@gmail.com',
          subject: 'Yelpcamp Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forget');
    });

  });

//RESET PASSWORD ROUTE
router.get('/reset/:token', function(req, res) {

  Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
        
      req.flash('error', 'Password reset token is invalid or has expired.');
      //console.log(err);
      return res.redirect('/forget');
    }
    console.log(user);
    res.render('reset.ejs',{token:req.params.token});
  });
});

//RESET PASSWORD LOGIC AND CONFIRMATION MAIL SENDING
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {

      Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
           user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'imsg895@gmail.com',
          pass: process.env.epassword
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'imsg895@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});




module.exports=router;