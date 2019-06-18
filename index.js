//this file contains all the middleware and the dependencies initialized in the app
const express=require('express');
const passport=require('passport');
const cookie=require('cookie-parser');
const body=require('body-parser');
const flash=require('connect-flash');
const session=require('express-session');
const validator=require('express-validator');
const mongoose=require('mongoose')
const frontpage=require('./controller/frontpage')
require('./config/passport');
var app=express();
mongoose.connect('mongodb://localhost/user',{useNewUrlParser:true});
app.set('view engine','ejs');
app.use(body.json());
app.use('/public',express.static('public'))
app.use(body.urlencoded({extended:false}));
app.use(validator());
//use validator after body parser is done
app.use(cookie());
app.use(session({secret:"my secret alien friend",resave:false,saveUnitialized:false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//this part gives login as a variable to be visible in all the views 
app.use(function(req,res,next){
    res.locals.login=req.isAuthenticated();
    next();
});
app.get('/',(req,res)=>{
    res.render('frontpage');
});
//using the router involving the user sign in and sign up part
app.use('/user',require('./controller/frontpage'));
app.listen(3000,function(){
    console.log('listening to port 3000');

});

