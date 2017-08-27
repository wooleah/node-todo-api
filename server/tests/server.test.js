const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';
		request(app)
		.post('/todos')
		.send({ //send object, but supertest is going to convert it to json
			text: text //or just text using es6 syntax
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if(err){
				//return stops function execution
				return done(err); //print err to the screen
			}
			Todo.find({text}).then((todos) => { //find all todos
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((err) => done(err));
		});
	});

	it('should not create todo with invalid body data', (done) => {
		request(app)
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) => {
			if(err){
				return done(err);
			}
			Todo.find().then((todo) => {
				expect(todo.length).toBe(2);
				done();
			}).catch((err) => done(err));
		});
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(2);
		})
		.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done);
	});
	it('should return 404 if todo not found', (done) => {
		request(app)
		.get(`/todos/${new ObjectID().toHexString()}`)
		// .expect(404)
		.expect((res) => {
			expect(res.status).toBe(404);
		})
		.end(done);
	})
	it('should return 404 for non-object ids', (done) => {
		request(app)
		.get('/todos/123')
		.expect(404)
		.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
		.delete(`/todos/${hexId}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo._id).toBe(hexId);
		})
		.end((err, res) => {
			if(err){
				return done(err); //so error gets rendered by mocha
			}
			Todo.findById(hexId).then((todo) => {
				expect(todo).toNotExist();	
				done();
			}).catch((err) => done(err));
		});
	});
	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectID().toHexString();
		
		request(app)
		.delete(`/todos/${hexId}`)
		.expect(404)
		.end(done);	
	});
	it('should return 404 if object id is invalid', (done) => {
		request(app)
		.delete('/todos/123')
		.expect(404)
		.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = 'testing patch route';

		request(app)
		.patch(`/todos/${hexId}`)
		.send({
			completed: true,
			text
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(res.body.todo.completedAt).toBeA('number');
		})
		.end(done);

	});

	it('should clear completedAt when todo is not completed', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = 'testing again';

		request(app)
		.patch(`/todos/${hexId}`)
		.send({
			text,
			completed: false
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toNotExist();
		})
		.end(done);
	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token) //set req header(header name, header val)
		.expect(200)
		.expect((res) => {
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		.end(done);
	});
	it('should return 401 if not authenticated', (done) => {
		request(app)
		.get('/users/me')
		.expect(401)
		.expect((res) => {
			//use toEqual when comparing object
			expect(res.body).toEqual({});
		})
		.end(done);
	})
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = 'test@test.com';
		var password = 'test123';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(200)
		.expect((res) => {
			//can't use . notation if name has - in it
			expect(res.headers['x-auth']).toExist();
			expect(res.body._id).toExist();
			expect(res.body.email).toBe(email);
		})
		.end((err) => {
			if(err){
				return done(err);
			}
			User.findOne({email}).then((user) => {
				expect(user).toExist();
				expect(user.password).toNotBe(password);
				done();
			});
		});
	});
	it('should return validation error if request invalid', (done) => {
		var email = 'abcd';
		var password = '1234';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end(done);
	});
	it('should not create user if email in user', (done) => {
		var email = 'test1@gmail.com';
		var password = 'password';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end(done);
	});
});