var express = require('express');
//body-parser takes your json and convert it to an object + attaching it to req object
var bodyParser = require('body-parser');

//calling mongoose property in an object(exported), using destructuring
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json()); //return value is the function we need

//POST - creating new todos
app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});
	todo.save().then((doc) => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(err);
	});
});

app.listen(3000, () => {
	console.log('Started on port 3000');
});