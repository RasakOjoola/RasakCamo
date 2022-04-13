const express = require('express');
const res = require('express/lib/response');
const User = require('../models/user');
const router = express.Router({ mergeParams: true });
const passport = require('passport')
const catchAsync = require('../utility/catchAsync')
const users = require('../controllers/userController');
const review = require('../models/review');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)




module.exports = router