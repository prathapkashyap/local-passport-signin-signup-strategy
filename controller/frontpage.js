var csrf=require('csurf');
var passport=require('passport');
var mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/user',{useNewUrlParser:true});
const express=require('express');
const router=express.Router();

//csrf protection to prevent the session from being stolen
var csrfProtection=csrf();
router.use(csrfProtection);
router.get('/profile',isLoggedIn,(req,res)=>{
    res.render('profile')
});
router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/')
});

//using the function notLoggedIn to make sure that the users who are not logged only are given these routes

router.use('/',notLoggedIn,function(req,res,next){
    next();
})
router.get('/signup',(req,res)=>{
        var messages=req.flash('error')
        res.render('signup',{csrfToken:req.csrfToken(),messages:messages,hasError:messages.length>0});
    });

//passport authentication part to signup the user
    router.post('/signup',passport.authenticate('local.signup',{
        successRedirect:'profile',
        failureRedirect:'signup',
        failureFlash:true
    }));

    router.get('/signin',(req,res)=>{
        var messages=req.flash('error');
        res.render('signin',{csrfToken:req.csrfToken(),messages:messages,hasError:messages.length>0});
    });

    router.post('/signin',passport.authenticate('local.signin',{
        successRedirect:'profile',
        failureRedirect:'signin',
        failureFlash:true
    }));

    //route protection
    //to give acess to the authenticated users only
    function isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/');
    }

    //to  give access only if not logged in 
    function notLoggedIn(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        res.redirect('/');
    }

module.exports=router
