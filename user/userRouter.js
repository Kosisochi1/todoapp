const express = require('express');

const userController = require('./userController');
const jwt = require('jsonwebtoken');
const cookiePearser = require('cookie-parser');
const { authenticate } = require('../auth/auth.js');
const middleware = require('../user/user_middleWare.js');

const router = express.Router();
// router.use(cookiePearser());

router.post('/signup', middleware.validateUser, userController.createUser);
router.post('/login', middleware.validateLogin, userController.LoginUser);

module.exports = router;
