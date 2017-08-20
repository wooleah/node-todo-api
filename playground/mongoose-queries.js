const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59999311984ffc2e385120c2';
var id = '59999311984ffc2e385120c21';
var userid = '59951f1ee2578232644ec4af';

if(!ObjectID.isValid(userid)){
	console.log('ID not valid');
}

// Todo.find({
// 	_id: id //mongoose takes the string and conver it to object and query it
// }).then((todos) => {
// 	console.log('Todos: ', todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo:', todo);
// });

// Todo.findById(id).then((todo) => {
// 	if(!todo){
// 		return console.log('id not found');
// 	}
// 	console.log('Todo by id:',todo);
// }).catch((err) => console.log(err));

User.findById(userid).then((user) => {
	if(!user){
		return console.log('Unable to find user');
	}
	console.log(JSON.stringify(user, undefined, 2));
}, (err) => {
	console.log(err.toString())
});