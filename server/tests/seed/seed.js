const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
	_id: userOneId,
	email: 'test1@gmail.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		//jwt.sign({_id: string, access}, 'secret')
		//when using jwt, payload is coerced to a string if it's an object literal
		//so no need to call .toHexString() on userOneId
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'woojae0219').toString()
	}]
}, {
	_id: userTwoId,
	email: 'test2@gmail.com',
	password: 'userTwoPass'
}];

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 123
}];

const populateTodos = (done) => { //runs before every test case, and only move to test case when done is called
	Todo.remove({}).then(() => { //remove all todos
		//for testing purposes, add seed data	
		return Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save(); //returns promise
		var userTwo = new User(users[1]).save();

		//Promise.all() returns a single Promise that resolves
		//when all of the promises in the iterable argument(arr or str) has resolved
		return Promise.all([userOne, userTwo])
		.then(() => done());

	});
};

module.exports = {todos, populateTodos, users, populateUsers};