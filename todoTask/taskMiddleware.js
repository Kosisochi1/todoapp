const joi = require('joi');

const validateItem = async (req, res, next) => {
	try {
		const schema = joi.object({
			Username: joi.string().required(),
			Password: joi.string().required(),
		});
		await schema.validateAsync(req.body, { abortEarly: true });
		next();
	} catch (error) {
		return res.status(422).json({
			massage: 'Validate Task',
			success: false,
		});
	}
};

module.exports = {
	validateItem,
};
