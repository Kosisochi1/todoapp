const TaskModel = require('../model/task_model');

const CreateTask = async ({ Task, user_id }) => {
	try {
		const reqTask = { Task, user_id };
		const taskCreate = await TaskModel.create(reqTask);
		return {
			massage: 'Task Added ',
			code: 201,
			data: { taskCreate },
		};
	} catch (error) {
		return {
			massage: 'Task not created',
			code: 400,
		};
	}
};
const tasks = async ({ Status, user_id }) => {
	const reqBody = { Status, user_id };
	try {
		const displayTask = await TaskModel.find({});
		return {
			massage: 'All the list',
			code: 200,
			data: {
				displayTask,
			},
		};
	} catch (error) {
		return {
			massage: 'No Task List',
			code: 400,
		};
	}
};
const tasksFilter = async ({ Status, user_id }) => {
	try {
		const displayTask = await TaskModel.find({ Status: 'completed' });
		return {
			massage: 'completed',
			code: 200,
			data: {
				displayTask,
			},
		};
	} catch (error) {
		return {
			massage: 'completed List',
			code: 400,
		};
	}
};
//pending tasks
const tasksPending = async ({ Status, user_id }) => {
	try {
		const displayTask = await TaskModel.find({ Status: 'Pending' });
		return {
			massage: 'completed',
			code: 200,
			data: {
				displayTask,
			},
		};
	} catch (error) {
		return {
			massage: 'Pending List',
			code: 400,
		};
	}
};
const updateTask = async ({ _id }) => {
	const reqCheck = { _id };
	try {
		const changeState = await TaskModel.findByIdAndUpdate(reqCheck, {
			Status: 'completed',
		});

		return {
			massage: 'completed',
			data: {
				changeState,
			},
		};
	} catch (error) {
		return {
			massage: 'Not Updated',
		};
	}
};

const undoTaskUpdate = async ({ _id }) => {
	const reqCheck = { _id };
	try {
		const changeState = await TaskModel.findByIdAndUpdate(reqCheck, {
			Status: 'Pending',
		});

		return {
			massage: 'Pending',
			data: {
				changeState,
			},
		};
	} catch (error) {
		return {
			massage: 'reverted',
		};
	}
};
const deleteTask = async ({ _id }) => {
	const reqCheck = { _id };
	try {
		const deleteT = await TaskModel.findByIdAndDelete(reqCheck);
		return {
			massage: 'Task deleted',
		};
	} catch (error) {
		return {
			massage: 'not deleted',
		};
	}
};

module.exports = {
	CreateTask,
	tasks,
	updateTask,
	undoTaskUpdate,
	deleteTask,
	tasksFilter,
	tasksPending,
};
