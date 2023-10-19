const UserModel = require('../model/user_model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../logger/index');

const createUser = async ({ Username, Password }) => {
	try {
		logger.info('[CreateUser] => Create  user process started');
		const userReq = { Username, Password };
		const existingUser = await UserModel.findOne({
			Username: userReq.Username,
		});
		if (existingUser) {
			logger.info('[CreateUser] => existing User');

			return {
				massage: 'User already created',
				code: 409,
			};
		}

		const loginUser = await UserModel.create({
			Username: userReq.Username,
			Password: userReq.Password,
		});
		const token = await jwt.sign(
			{ Username: loginUser.Username, _id: loginUser._id },
			process.env.SECRETE_KEY
		);
		logger.info('[CreateUser] => user successfully created');

		return {
			massage: 'User created successful',
			code: 201,
			data: {
				token,
				loginUser,
			},
		};
	} catch (error) {
		return {
			massage: 'Server error',
			code: 500,
			data: null,
		};
	}
};

const LoginUser = async ({ Username, Password }) => {
	try {
		logger.info('[LoginUser] => Login  process started');

		const loginReq = { Username, Password };
		const loginUser = await UserModel.findOne({ Username: loginReq.Username });
		if (!loginUser) {
			return {
				massage: 'User not found',
				code: 404,
			};
		}
		const valididatePassword = await loginUser.isValidPassword(
			loginReq.Password
		);
		if (!valididatePassword) {
			logger.info('[LoginUser] => Invalid Password or Username');

			return {
				massage: 'Incorrect Password or Email',
				code: 422,
			};
		}
		const token = await jwt.sign(
			{ Username: loginUser.Username, _id: loginUser._id },
			process.env.SECRETE_KEY,
			{ expiresIn: '1h' }
		);
		logger.info('[LoginUser] => Login process done');

		return {
			massage: 'Login successful',
			code: 200,
			data: {
				loginUser,
				token,
			},
		};
	} catch (error) {
		return {
			massage: 'Login Failed',
		};
	}
};

module.exports = {
	createUser,
	LoginUser,
};
