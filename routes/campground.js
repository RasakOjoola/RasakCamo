const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const Campground = require('../models/campground');
const { CampgroundSchema } = require('../schemas');
const { request } = require('express');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const { equal } = require('joi');
const campground = require('../controllers/campgroundController')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.createCampground))


router.get('/new', isLoggedIn, campground.renderNewForm)

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

router.route('/:id')
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))
    .get(catchAsync(campground.showCampground))



module.exports = router