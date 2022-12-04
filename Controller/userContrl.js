let User = require("../schemaModel/userSchema");

module.exports.regForm = (req,res)=>{
    res.render('passport/registerForm')
}

module.exports.regPost = async(req,res)=>{
    try{
    let {email , username , password} = req.body
    let newUser = new User({email,username})
    let registerUser = await User.register(newUser,password)
    req.login(registerUser, function(err) {
        if (err) { return next(err); }
        req.flash('Success','You have successfully register')
        return res.redirect('/campground')
    });
    
    }catch(e)
    {
        req.flash('Error',e.message)
        res.redirect('/register')
    }
}

module.exports.loginForm = (req,res)=>{
    res.render('passport/loginForm')
}

module.exports.loginPost = async(req,res)=>{
    req.flash('Success','Successfully Login Into Campgrounds')
    let redirectUrl = req.session.returnTo || '/campground'
    delete req.session.returnTo
    res.redirect(redirectUrl)
    //res.redirect('/campground')
}

module.exports.logOut = async(req,res)=>{
    req.logout(req.user, err => {
        if(err) return next(err);
            req.flash('Success' , 'Sucessfully logout')
          res.redirect("/login");
        });
}