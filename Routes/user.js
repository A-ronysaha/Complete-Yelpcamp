let express = require('express')
let router = express.Router();
let User = require("../schemaModel/userSchema");
let catchAsync = require('../Error_Model/asyncError')
let passport = require('passport')

let userControler = require('../Controller/userContrl')

router.route('/register')
    .get(userControler.regForm)
    .post(catchAsync(userControler.regPost))


router.route('/login')
    .get(userControler.loginForm)
    .post(passport.authenticate('local',
    { failureFlash : true ,  failureRedirect: '/login' }),catchAsync(userControler.loginPost))

router.get('/logout',userControler.logOut)



module.exports = router