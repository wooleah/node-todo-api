var express = require('express');
//body-parser lets us take json and send it to server
//takes body and turns(parse) it into javascript object
//body-parser takes your json and convert it to an object + attaching it to req object
var bodyParser = require('body-parser');

//calling mongoose property in an object(exported), using destructuring
//if the var name and property name matches
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();

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


app.listen(3000, () => {
	console.log('Started on port 3000');
});

module.exports = {app}; //app: app->shortened ES6
//or
//module.exports.app = app;