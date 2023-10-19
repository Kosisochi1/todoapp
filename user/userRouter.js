const express = require('express');

const userService = require('./userService_controller.js');
const jwt = require('jsonwebtoken');
const cookiePearser = require('cookie-parser');
const { authenticate } = require('../auth/auth.js');
const middleware = require('../user/user_middleWare.js');

const router = express.Router();
router.use(cookiePearser());

// router.post('/signup', middleware.validateUser, async (req, res) => {
// 	console.log(req.body);
// 	const response = await userService.createUser({
// 		Username: req.body.username,
// 		Password: req.body.password,
// 	});
// 	if (response.code === 201) {
// 		res.redirect('/login');
// 	} else {
// 		res.render('signup');
// 	}
// });

module.exports = router;
