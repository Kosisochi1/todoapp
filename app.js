const express = require('express');
require('dotenv').config();
const view_router = require('./views/view_router');
const userRouter = require('./user/userRouter');
const db = require('./db');

const userService = require('./user/userService_controller.js');
const createTask = require('./todoTask/createTask_service');
const middleware = require('./user/user_middleWare');
const TaskModel = require('./model/task_model');
const { authenticate } = require('./auth/auth');

const jwt = require('jsonwebtoken');
const cookiePearser = require('cookie-parser');
const { find } = require('./model/user_model');
const router = express.Router();
const app = express();

const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(cookiePearser());

// app.use(express.json());

app.set('view engine', 'ejs');
// app.use('/views', view_router);
// app.use('/users', userRouter);

app.get('/views/index', (req, res) => {
	res.render('index', { LoginUser: res.locals.loginUser || null });
});

//route to signup page
app.get('/views/signup', async (req, res) => {
	res.render('signup', { LoginUser: res.locals.loginUser || null });
});

// //route to Login Page
app.get('/views/login', (req, res) => {
	res.render('login');
});

//Signup
app.post('/views/signup', middleware.validateUser, async (req, res) => {
	console.log(req.body);
	const response = await userService.createUser({
		Username: req.body.username,
		Password: req.body.password,
	});
	if (response.code === 201) {
		res.redirect('/views/login');
	} else if (response.code === 409) {
		res.render('user_exist');
	} else {
		res.render('server_error');
	}
});

// Login
app.post('/views/login', middleware.validateLogin, async (req, res) => {
	console.log(req.body);
	const response = await userService.LoginUser({
		Username: req.body.username,
		Password: req.body.password,
	});
	if (response.code === 200) {
		res.cookie('jwt', response.data.token, { maxAge: 60 * 60 * 1000 });
		res.redirect('/home');
	} else if (response.code === 422) {
		res.render('incorrectepass');
	} else {
		res.render('User_not_found');
	}
});

//route to create task
app.get('/views/createTask', (req, res) => {
	res.render('createTask');
});
// router.use(authenticate);
app.get('/home', authenticate, async (req, res) => {
	const response = await createTask.tasks({
		user_id: res.locals.loginUser._id,
		Status: 'Pending' || 'completed',
	});
	res.render('home', {
		loginUser: res.locals.loginUser,
		tasks: response.data.displayTask,
	});
});
app.get('/views/filter', authenticate, async (req, res) => {
	const response = await createTask.tasksFilter({
		user_id: res.locals.loginUser._id,
		Status: 'completed',
	});
	res.render('filter', {
		loginUser: res.locals.loginUser,
		tasks: response.data.displayTask,
	});
});
app.get('/views/filterCompleted', authenticate, async (req, res) => {
	const response = await createTask.tasksPending({
		user_id: res.locals.loginUser._id,
		Status: req.body.filter,
	});
	res.render('filterCompleted', {
		loginUser: res.locals.loginUser,
		tasks: response.data.displayTask,
	});
});
// filter
app.post('/views/filter', authenticate, async (req, res) => {
	console.log(req.body.filter);
	if (req.body.filter === 'completed') {
		await createTask.tasksFilter({
			Status: 'completed',
			user_id: res.locals.loginUser._id,
		});
		res.redirect('/filter');
	} else if (req.body.filter === 'Pending') {
		await createTask.tasksPending({
			Status: 'Pending',
			user_id: res.locals.loginUser._id,
		});
		res.redirect('/filterCompleted');
	} else {
		await createTask.tasks({
			Status: 'Pending' || 'completed',
			user_id: res.locals.loginUser._id,
		});
		res.redirect('/home');
	}
});

//create Task
app.post('/views/createTask', authenticate, async (req, res) => {
	const response = await createTask.CreateTask({
		Task: req.body.task,
		user_id: res.locals.loginUser._id,
	});
	res.redirect('/home');
});
//Get all Tasks
//Change state of task
app.post('/views/change', authenticate, async (req, res) => {
	await createTask.updateTask(
		{ _id: req.body.checkbox },
		{ Status: 'completed' }
	);

	res.redirect('/home');
});
// Unchange Taske
app.post('/views/unchange', authenticate, async (req, res) => {
	await createTask.undoTaskUpdate(
		{ _id: req.body.checkbox },
		{ Status: 'completed' }
	);

	res.redirect('/home');
});
//Delete Task
app.post('/views/delete', authenticate, async (req, res) => {
	await createTask.deleteTask({ _id: req.body.delete });

	res.redirect('/home');
});
//logout
app.get('/views/logout', authenticate, (req, res) => {
	res.clearCookie('jwt');
	res.redirect('/views/index');
});
app.get('/views/filter', authenticate, (req, res) => {
	res.render('filter');
});

app.get('*', (req, res) => {
	return res.status(404).json({
		data: null,
		error: 'Route not found',
	});
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		data: null,
		error: 'Server Error',
	});
});
// module.exports = app;

db.connect();

app.listen(PORT, () => {
	console.log('Server Started');
});
