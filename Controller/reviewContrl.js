let Campground = require('../schemaModel/campground')
let Review = require("../schemaModel/review");

module.exports.writeReview = async(req,res)=>{
    let {id} = req.params
    let reviewId = await Campground.findById(id)
    let theReview = new Review(req.body.review)
    theReview.author = req.user._id
    reviewId.reviews.push(theReview)
    await theReview.save()
    await reviewId.save()
    req.flash('Success','Successfully create review')
    res.redirect(`/campground/${reviewId._id}`)
  }

module.exports.dltReview = async(req,res)=>{
    let {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('Success','Successfully delete the review')
    res.redirect(`/campground/${id}`)
  }