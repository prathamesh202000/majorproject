const User=require("../models/user.js");

module.exports.signUpFrom=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp=async (req,res)=>{
    try{
        let {username, email, password}=req.body;
    let newUser=new User({email, username});
     let registeredUser = await User.register(newUser,password);
     console.log(registeredUser);
     req.login(registeredUser,(err)=>{
        if(err){return next(err);}
        req.flash("success","Welcome to WanderLust!");
    res.redirect("/listing");

     });
    
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=(req,res)=>{
    req.flash("success","Welcome Back to WonderLust!");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully Logged Out!");
        res.redirect("/listing");
    });
};
