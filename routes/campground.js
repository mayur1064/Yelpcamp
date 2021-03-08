const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/cathAsync');
const {isLoggedIn,isAuthor,validateCampground} = require('../middlewares.js')
const campgrounds = require('../controllers/campground.js')
const {storage} = require('../cloudinary')
const multer = require('multer')
const upload = multer({storage})


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn , upload.array('image'),validateCampground ,catchAsync(campgrounds.createCampground))
    //.post(upload.array('image'),(req,res) => {
    //     console.log(req.body,req.files)
    //     res.send('IT worked')
    // })

router.get('/new',isLoggedIn , campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
module.exports = router