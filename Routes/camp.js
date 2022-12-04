let express = require("express");
let router = express.Router();
let Campground = require("../schemaModel/campground");
let catchAsync = require("../Error_Model/asyncError");
let ExpressError = require("../Error_Model/expressError");
let { formValidateSchema } = require("../joiSchema.js");

let { isLoggedIn } = require("../loggedInMidlwre");

let serverSiteFormValidation = (req, res, next) => {
  let { error } = formValidateSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(","); // Server side validation is done by JOI.
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

let multer = require("multer");
let { storage } = require("../cloudinary/cloud");
let upload = multer({ storage });

let campController = require("../Controller/campgroundContrl");

router
  .route("/")
  .get(catchAsync(campController.campList))
  .post(
    isLoggedIn,
    upload.array("image"),
    serverSiteFormValidation,
    catchAsync(campController.campPost)
  );

router.get("/new", isLoggedIn, catchAsync(campController.campNew));

router
  .route("/:id")
  .get(catchAsync(campController.campId))
  .put(isLoggedIn, upload.array("image"), catchAsync(campController.campUpdate))
  .delete(
    isLoggedIn,
    serverSiteFormValidation,
    catchAsync(campController.campDlt)
  );

router.get("/:id/edit", isLoggedIn, catchAsync(campController.campEdit));

module.exports = router;

// Instead of create permission to do edit/delete in every req,we can put that permission code in a middleware.
// But my code"s variable is different in different request path. So dont shift the permision in a middleware
