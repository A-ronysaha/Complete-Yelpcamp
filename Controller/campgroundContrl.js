let Campground = require("../schemaModel/campground")
const {cloudinary} = require('../cloudinary/cloud')

let mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
let mapBoxToken = process.env.MAPBOX_TOKEN
let geocoder = mbxGeocoding({ accessToken: mapBoxToken})

module.exports.campList = async(req,res)=>{
    let allCamp = await Campground.find({})
    res.render('campgroundDetails/list',{allCamp})
}

module.exports.campNew = async(req,res)=>{
    let logInUser = req.user
      res.render('campgroundDetails/newCamp',{logInUser})
}

module.exports.campPost = async(req,res)=>{
  let geoData = await geocoder.forwardGeocode({
    query: req.body.camp.location,
    limit: 1
  }).send()
    let newCamp = new Campground(req.body.camp)
    newCamp.geometry = geoData.body.features[0].geometry
    req.flash('Success','Location is found','&')
    newCamp.images = req.files.map(f=>({url: f.path , filename: f.filename}))
    newCamp.author = req.user._id
    //console.log(newCamp)
    await newCamp.save()
    req.flash('Success','Successfully created new campgrounds')
    res.redirect(`/campground/${newCamp._id}`)
}

module.exports.campId = async(req,res)=>{
    let {id} = req.params
    let showCamp = await Campground.findById(id).populate({
      path : "reviews",
      populate : {
        path: 'author'
      }
    }).populate('author');
    if(!showCamp)
    {
      req.flash('Error','Campground is not found')
      return res.redirect('/campground')
    }
   // console.log(showCamp)
   res.render('campgroundDetails/idCamp',{showCamp})
}

module.exports.campEdit = async(req,res)=>{
    let {id} =req.params
    let editCamp = await Campground.findById(id)
    if(!editCamp)
      {
        req.flash('Error','Campground is not found')
        return res.redirect('/campground')
      }else{
    if(!editCamp.author.equals(req.user._id))
    {
      req.flash('Error','You dont have permisson do that')
      return res.redirect(`/campground/${id}`)
    }else{
    res.render('campgroundDetails/updateCamp' , {editCamp})
    }
  }
}

module.exports.campUpdate = async(req,res)=>{
  let {id} =req.params
  //console.log(req.body)
    let currentId = await Campground.findById(id)
    if(!currentId.author.equals(req.user._id))
    {
      req.flash('Error','You dont have permisson do that')
      return res.redirect(`/campground/${id}`)
    }else{
    let updtCamp = await Campground.findByIdAndUpdate(id,{...req.body.camp},{runValidators:true , new : true})
     let updtImgs = req.files.map ((f)=>({url: f.path , filename: f.filename}))
    updtCamp.images.push(...updtImgs)
    await updtCamp.save()
    if(req.body.deleteImages)
    {
      for(let filename of req.body.deleteImages)
      {
        await cloudinary.uploader.destroy(filename)
      }
      await updtCamp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}},{new:true})
    }
    req.flash('Success',"Successfully update this campground")
    res.redirect(`/campground/${updtCamp._id}`)
    }
  }

module.exports.campDlt = async(req,res)=>{
    let {id} =req.params
    let currentId = await Campground.findById(id)
    if(!currentId.author.equals(req.user._id))
    {
      req.flash('Error','You dont have permisson do that')
      return res.redirect(`/campground/${id}`)
    }
    let dltCamp = await Campground.findByIdAndDelete(id)
    req.flash('Success','Successfully delete the campground')
    res.redirect('/campground')
  }