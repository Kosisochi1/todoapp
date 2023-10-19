const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.ObjectId;

const UserSchema = new Schema({
	Username: {
		type: String,
		require: true,
	},
	Password: {
		type: String,
		require: true,
	},
});
UserSchema.pre('save', async function (next) {
	const hash = await bcrypt.hash(this.Password, 10);
	this.Password = hash;
	next();
});
UserSchema.methods.isValidPassword = async function (password) {
	const comparePassword = await bcrypt.compare(password, this.Password);
	return comparePassword;
};
const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
