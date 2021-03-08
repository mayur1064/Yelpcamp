const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/cathAsync')
const passport = require('passport')
const user = require('../controllers/users.js')
const { route } = require('./campground')




router.route('/register')
    .get(user.renderRegisterForm)
    .post(catchAsync(user.registerUser))



router.route('/login')
    .get(user.renderLoginForm)
    .post(passport.authenticate('local',{failureFlash : true , failureRedirect : '/login'}) ,catchAsync(user.loginUser))

router.get('/logout',user.logoutUser)



module.exports = router;