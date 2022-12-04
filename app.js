if (process.env.NODE_env !== "PRODUCTION") {
  require("dotenv").config();
}

let express = require("express");
let app = express();
let path = require("path");
let overRide = require("method-override");
let ejsMate = require("ejs-mate");

let mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/all_yelpCamp")
  .then(() => {
    console.log("CONNECTION ESTD !!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR !!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(overRide("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

let Campground = require("./schemaModel/campground");
let Review = require("./schemaModel/review");
let catchAsync = require("./Error_Model/asyncError");
let ExpressError = require("./Error_Model/expressError");
let Joi = require("joi");

// Server side validation is done by JOI. If during validation any error occur,then
// that error will be handeled by below two middleware respectively

let { formValidateSchema, reviewValidateSchema } = require("./joiSchema.js");

let serverSiteFormValidation = (req, res, next) => {
  let { error } = formValidateSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

let serverSiteReviewValidation = (req, res, next) => {
  let { error } = reviewValidateSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

///   ****** SESSION & FLASH  ***** /////

let session = require("express-session");
let sessionOption = {
  secret: "notgood",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionOption));

let flash = require("connect-flash");
app.use(flash());
app.use((req, res, next) => {
  res.locals.keySuccess = req.flash("Success");
  res.locals.keyErr = req.flash("Error");
  next();
});

//// ***** PASSPORT ******  ////

let passport = require("passport");
let LocalStrategy = require("passport-local");
let User = require("./schemaModel/userSchema");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // console.log(req.session)
  res.locals.currentUser = req.user;
  next();
});

////  ***  ROUTE ---> CAMPGROUND & REVIEW & USER  **** ////

let campRoutes = require("./Routes/camp");
app.use("/campground", campRoutes);

let reviewRoute = require("./Routes/revw");
app.use("/campground/:id/reviews", reviewRoute);

let userRoute = require("./Routes/user");
app.use("/", userRoute);

//////// ----------------------------- /////////

app.get("/", (req, res) => {
  res.render("home");
});

///   *****  ERROR PART   ***** ////

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  console.log("Error -->>", err);
  let { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "hey Champ, You make errors......";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, (req, res) => {
  console.log("LISTENING ON PORT");
});
