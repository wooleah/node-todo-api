require('./config/config'); //triggers config file

const _ = require('lodash');
const express = require('express');
//body-parser lets us take json and send it to server
//takes body and turns(parse) it into javascript object
//body-parser takes your json and convert it to an object + attaching it to req object
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

//calling mongoose property in an object(exported), using destructuring
//if the var name and property name matches
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

//configuring middleware(body-parser)
app.use(bodyParser.json()); //return value is the function we need to give to express

//POST - creating new todos
app.post('/todos', (req, res) => {
	// console.log(req.body); //you need body-parser to do this
	var todo = new Todo({
		text: req.body.text
	});
	todo.save().then((doc) => { //success case
	//save()->change is saved
	//Mongoose async operations like .save() returns Promises
		res.send(doc);
	}, (err) => { //error case
		res.status(400).send(err);
	});
});

//GET - list all todos
app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos}); //or {todos: todos}
		//When you pass an array, you can't add anymore properties(status code or other data)
		//therefore, pass an object to be more flexible
	}, (err) => {
		res.status(400).send(err);
	});
});

//GET /todos/id
app.get('/todos/:id', (req, res) => { //creates id var
	// req.params //it's an object
	// res.send(req.params);
	var id = req.params.id;

	//valid id using invalid
	 //404 -send back empty body
	 if(!ObjectID.isValid(id)){
	 	res.status(404).send();
	 }else{
	 	Todo.findById(id).then((todo) => {
	 		if(!todo){
	 			res.status(404).send();
	 		}else{
	 			res.send({todo});
	 		}
	 	}, (err) => {
	 		res.status(400).send();
	 	});
	 }
});

//DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}
	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo){
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((err) => {
		res.status(400).send();
		// console.log(err);
	});
});

//PATCH, HttpPatch
app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']); //create an object

	//_id validation
	if(!ObjectID.isValid(id))
		return res.status(404).send();

	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	}else{ //if body.completed is not a boolean or it's not true
		body.completed = false;
		body.completedAt = null;
	}

	//id, update(needs mongodb operator), option -> return query -> can use promise
	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if(!todo){
			return res.status(400).send();
		}
		res.send({todo}); //and we can fetch this with res.body.todo.property
	}).catch((err) => {
		res.status(400).send(); 
	});

});

//POST /users
app.post('/users', (req, res) => {
	//1. create new instance of the model
	var body = _.pick(req.body, ['email', 'password']); //source obj, property to pick
	var user = new User(body);

	//model method
	// User.findByToken();
	//instance method(individual user)
	// user.generateAuthToken();

	//2. call save - save to the db
	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user); //x- means that you're using custom header
	}).catch((err) => {
		res.status(400).send(err);
	});
	//3. things go well -> send
	//4. things go poorly -> send error
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

//POST /users/login {email, password}
app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.status(400).send();
	});

	// var email = req.body.email;
	// var password = req.body.password;

	// User.findOne({email}).then((user) => {
	// 	bcrypt.compare(password, user.password, (err,result) => {
	// 		if(err){
	// 			console.log(err);
	// 		}
	// 		if(result){
	// 			var user = {email, password};
	// 			res.send(user);
	// 		}
	// 	});	
	// });
});


app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app}; //app: app->shortened ES6
//or
//module.exports.app = app;