module.exports.isLoggedIn = (req,res,next) =>{
  
    //console.log("REQ.User is.....",req.user)
      if(!req.isAuthenticated())
    {
        //console.log( req.url)      
      req.session.returnTo = req.originalUrl //store the url they requesting 
      req.flash('Error','You must need to Sign In')
      return res.redirect('/login')
    }
    next()
  }