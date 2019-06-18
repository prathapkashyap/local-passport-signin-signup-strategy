const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../model/user');

// to store the user in the session accordin their user id
passport.serializeUser(function(user,done){
    done(null,user.id)
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user)
    });
});

//using the local strategy to create a new user
passport.use('local.signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
    //the callback function to take  care of the user signin part
},function(req,email,password,done){
//validation of different fields using express-validator
    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('password','password not acceptable').notEmpty().isLength({min:5});
    
    var errors=req.validationErrors();
    
    if(errors){
        //if errors exist create an array of messages that can be passed back to the view
        var messages=[];
        errors.forEach((error)=>{
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }
    //check if hte user exists and if yes return failure in creating a new user 
    User.findOne({'email':email},function(err,user){
        if(err) {
            return done(err)
        }
        else{
            if(user){
                return done(null,false,{message:"user already exists"});

            }
            else{
                var newUser=new User();
                newUser.email=email;
                newUser.password=newUser.encryptPassword(password);
                newUser.save(function(err,result){
                    if(err){
                        done(err)
                    }
                    console.log(result)
                return done(null,newUser);

                    
                });
            }
        }
    });
}));

passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('password','password not entered').notEmpty();
    var errors=req.validationErrors();
    if(errors){
        //if errors exist create an array of messages that can be passed back to the view
        var messages=[];
        errors.forEach((error)=>{
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }

    User.findOne({'email':email},function(err ,user){
        console.log(user)
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false,{message:'user does not exist'});
        }
        if(!user.validatePassword(password)){
            return done(null,false,{message:'password incorrect'});
        }
        return done(null,user);
    });
}));