const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = async (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		try {
			const decodedValue = await jwt.verify(token, process.env.SECRETE_KEY);

			res.locals.loginUser = decodedValue;
			next();
		} catch (error) {
			res.redirect('index');
		}
	} else {
		res.redirect('index');
	}
};
module.exports = {
	authenticate,
};
