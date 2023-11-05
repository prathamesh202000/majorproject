const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");

//sigup //signup form
router.route("/signup")
.get(userController.signUpFrom)
.post(wrapAsync(userController.signUp));

//lognin
router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}), userController.login);

//logout
router.get("/logout",userController.logout);

module.exports=router;