const joi = require('joi');

const validateUser = async (req, res, next) => {
	try {
		const schema = joi.object({
			username: joi.string().required(),
			password: joi.string().required(),
		});
		await schema.validateAsync(req.body, { abortEarly: true });
		next();
	} catch (error) {
		return res.status(422).json({
			massage: 'Fill your Username and Password',
			success: false,
		});
	}
};
const validateLogin = async (req, res, next) => {
	// const LoginReq = req.body;
	try {
		const schema = joi.object({
			username: joi.string().required(),
			password: joi.string().required(),
		});
		await schema.validateAsync(req.body, { abortEarly: true });
		next();
	} catch (error) {
		return res.status(422).json({
			massage: error.massage,
			success: false,
		});
	}
};
module.exports = {
	validateUser,
	validateLogin,
};
