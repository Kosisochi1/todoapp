const UserModel = require('../model/user_model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../logger/index');

const createUser = async (req, res) => {
	try {
		const userReq = req.body;
		logger.info('[CreateUser] => Create  user process started');
		const existingUser = await UserModel.findOne({
			Username: userReq.Username,
		});
		if (existingUser) {
			logger.info('[CreateUser] => existing User');
			return res.status(409).json({
				massage: 'user already created',
			});
		}

		const loginUser = await UserModel.create({
			Username: req.body.Username,
			Password: req.body.Password,
		});
		const token = await jwt.sign(
			{ Username: loginUser.Username, _id: loginUser._id },
			process.env.SECRETE_KEY
		);
		logger.info('[CreateUser] => user successfully created');

		return res.status(201).json({
			massage: 'User successfully created',
			data: {
				token,
				loginUser,
			},
		});
	} catch (error) {
		return res.status(500).json({
			massage: 'Server error',
			data: null,
		});
	}
};
const LoginUser = async (req, res) => {
	try {
		logger.info('[LoginUser] => Login  process started');

		const loginReq = req.body;
		const loginUser = await UserModel.findOne({ Username: loginReq.Username });
		if (!loginUser) {
			return res.status(404).json({
				massage: 'User not Found',
			});
		}
		const valididatePassword = await loginUser.isValidPassword(
			loginReq.Password
		);
		if (!valididatePassword) {
			logger.info('[LoginUser] => Invalid Password or Username');

			return res.status(422).json({
				massage: 'Incorrect Password and Email',
			});
		}
		const token = await jwt.sign(
			{ Username: loginUser.Username, _id: loginUser._id },
			process.env.SECRETE_KEY,
			{ expiresIn: '1h' }
		);
		logger.info('[LoginUser] => Login process done');

		return res.status(200).json({
			massage: 'Login Successfully',
			data: {
				loginUser,
				token,
			},
		});
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
