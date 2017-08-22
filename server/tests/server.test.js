const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed: true,
	completedAt: 123
}];

beforeEach((done) => { //runs before every test case, and only move to test case when done is called
	Todo.remove({}).then(() => { //remove all todos
		//for testing purposes, add seed data	
		return Todo.insertMany(todos);
	}).then(() => done());
});





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