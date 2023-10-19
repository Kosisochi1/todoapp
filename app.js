const express = require('express');
const db = require('./db');
require('dotenv').config();
const view_router = require('./views/view_router');
const userRouter = require('./user/userRouter');

const app = express();
const PORT = process.env.PORT;
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use('/views', view_router);
app.use('/users', userRouter);

app.get('*', (req, res) => {
	return res.status(404).json({
		data: null,
		error: 'Route not found',
	});
});

db.connect();
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		data: null,
		error: 'Server Error',
	});
});
app.listen(PORT, () => {
	console.log('Server Started');
});
