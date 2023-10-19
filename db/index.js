const mongoose = require('mongoose');
require('dotenv').config();

const connect = async (url) => {
	mongoose.connect(url || process.env.DB_URL);
	mongoose.connection.on('connected', () => {
		console.log('Connected to Database Successfully');
	});
	mongoose.connection.on('error', (err) => {
		console.log('Connection to Database not Successfully');
	});
};
module.exports = {
	connect,
};
