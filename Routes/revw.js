let express = require('express')
let router = express.Router({mergeParams:true});
let Campground = require('../schemaModel/campground')
let Review = require("../schemaModel/review");
let catchAsync = require('../Error_Model/asyncError')
let ExpressError = require('../Error_Model/expressError')
let {reviewValidateSchema} = require('../joiSchema.js')

let {isLoggedIn} = require('../loggedInMidlwre')

let serverSiteReviewValidation = (req, res, next) => {
    let { error } = reviewValidateSchema.validate(req.body);
    if (error) {
      let msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };

let revControler = require('../Controller/reviewContrl')

router.post('',isLoggedIn,serverSiteReviewValidation,catchAsync(revControler.writeReview))
  
router.delete('/:reviewId',catchAsync(revControler.dltReview))

module.exports = router