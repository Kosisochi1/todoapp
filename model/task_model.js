const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;
const TaskSchema = new Schema({
	_id: {
		type: String,
		default: uuidv4,
	},

	Task: {
		type: String,
		require: true,
	},
	Status: {
		type: String,
		require: true,
		enum: ['Pending', 'completed'],
		default: 'Pending',
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
	},
});
const TaskModel = mongoose.model('tasks', TaskSchema);
module.exports = TaskModel;
