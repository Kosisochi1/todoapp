const { connect } = require('./database');
const app = require('../app');
const UserModel = require('../model/user_model');
const supertest = require('supertest');

// Test Suit
describe('User Creation Authentication', () => {
	beforeAll(async () => {
		await connect();
	});
	beforeEach(async () => {
		await connect().cleanup();
	});
	afterAll(async () => {
		await connect().disconnect();
	});

	//Test Case
	it(' It  should register User ', async () => {
		const response = await supertest(app)
			.post('/users/signup')
			.set('content-type', 'application/json')
			.send({ Username: 'kosi', Password: 'kosi' });
		expect(response.status).toEqual(201);
		expect(response.body.loginUser).toMatchObject({
			Username: 'kosi',
			Password: 'kosi',
		});
	});
});
