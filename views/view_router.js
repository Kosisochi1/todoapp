const express = require('express');

const userService = require('../user/userService_controller.js');
const router = express.Router();
const createTask = require('../todoTask/createTask_service.js');
const middleware = require('../user/user_middleWare.js');
const TaskModel = require('../model/task_model');

const jwt = require('jsonwebtoken');
const cookiePearser = require('cookie-parser');
const { authenticate } = require('../auth/auth.js');
const { find } = require('../model/user_model.js');

router.use(cookiePearser());
//landing page

router.get('/index', (req, res) => {
	res.render('index', { LoginUser: res.locals.loginUser || null });
});

//route to signup page
router.get('/signup', async (req, res) => {
	res.render('signup', { LoginUser: res.locals.loginUser || null });
});

// //route to Login Page
router.get('/login', (req, res) => {
	res.render('login');
});

//Signup
router.post('/signup', middleware.validateUser, async (req, res) => {
	console.log(req.body);
	const response = await userService.createUser({
		Username: req.body.username,
		Password: req.body.password,
	});
	if (response.code === 201) {
		res.redirect('login');
	} else {
		res.render('signup');
	}
});

// Login
router.post('/login', middleware.validateLogin, async (req, res) => {
	console.log(req.body);
	const response = await userService.LoginUser({
		Username: req.body.username,
		Password: req.body.password,
	});
	if (response.code === 200) {
		res.cookie('jwt', response.data.token, { maxAge: 60 * 60 * 1000 });
		res.redirect('home');
	} else {
		res.render('index');
	}
});

//route to create task
router.get('/createTask', (req, res) => {
	res.render('createTask');
});
// router.use(authenticate);
router.get('/home', authenticate, async (req, res) => {
	const response = await createTask.tasks({ user_id: res.locals.LoginUser });
	res.render('home', {
		loginUser: res.locals.loginUser,
		tasks: response.data.displayTask,
	});
});
//create Task
router.post('/createTask', authenticate, async (req, res) => {
	const response = await createTask.CreateTask({
		Task: req.body.task,
		user_id: res.locals.loginUser._id,
	});
	res.redirect('home');
});
//Get all Tasks
//Change state of task
router.post('/change', authenticate, async (req, res) => {
	await createTask.updateTask(
		{ _id: req.body.checkbox },
		{ Status: 'completed' }
	);

	res.redirect('home');
});
// Unchange Taske
router.post('/unchange', authenticate, async (req, res) => {
	await createTask.undoTaskUpdate(
		{ _id: req.body.checkbox },
		{ Status: 'completed' }
	);

	res.redirect('home');
});
//Delete Task
router.post('/delete', authenticate, async (req, res) => {
	await createTask.deleteTask({ _id: req.body.delete });

	res.redirect('home');
});
//logout
router.get('/logout', authenticate, (req, res) => {
	res.clearCookie('jwt');
	res.redirect('index');
});
router.get('/filter', authenticate, (req, res) => {
	res.render('filter', { loginUser: res.locals.loginUser });
});
router.post('/filter', async (req, res) => {
	res.redirect('home');
});
module.exports = router;