if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}


const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const app=express();
const port=8080;
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ejsMate=require("ejs-mate");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const { nextTick } = require("process");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const dbUrl=process.env.ATLASDB_URL;

app.listen(port,()=>{
console.log("Server is listening through port "+port);
});

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE", error);
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,

    },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

async function main(){
    await mongoose.connect(dbUrl);
}

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

// app.get("/",(req,res)=>{
//     res.send("/root");
// });






app.use("/listing",listingRouter);

app.use("/listing/:id/reviews",reviewRouter);

app.use("/",userRouter);


// app.get("/listingtest", async (req,res)=>{
// let sampleListing=new Listing(
//     {
//         title:"Mountain&Beach",
//         description:"beach",
//         price:1200,
//         location: "Goa",
//         country:"India",
//     }
// );
// await sampleListing.save();
// res.send("testing successful");
// });


//all other routes
app.all("*",(req,res, next)=>{
   next(new ExpressError(400, "Page not found!")); 
});

//error handling
app.use((err, req, res, next)=>{
    let{statusCode=500, message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

