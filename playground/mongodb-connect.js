// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
//ObjectID constructor function allows us to make new Objectid on the fly
//mongo native library: node-mongodb-native
//npm i mongo --save

var obj = new ObjectID();
console.log(obj);

// //Object destructuring
// var user = {name: 'Woojae', age: 28};
// var {name} = user;
// console.log(name); //make new var from obj property

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => { //db object
	//in mongodb, I can give it a name and mongodb will create new database for me
	//MongoClient.connect('mongodb://localhost:27017/NewApp')-> creates NewApp database
	if(err){
		return console.log('Unable to connect to MongoDB server');
		//due to the return statement, program stops here
	}
	console.log('Connected to MongoDB server');

	// db.collection('Todos').insertOne({
	// 	text: 'Someting to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if(err){
	// 		return console.log('Unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// 	//ops attribute is going to store(array) all the docs we're inserting-> currently just one
	// }); 
	// //callback gets executed when insert goes well or not
	// //result is provided when things go well

	// db.collection('Users').insertOne({
	// 	name: 'Woojae',
	// 	age: 28,
	// 	location: 'Seoul'
	// }, (err, result)=>{
	// 	if(err){
	// 		return console.log('Unable to insert user', err);
	// 	}
	// 	// console.log(JSON.stringify(result.ops,undefined,2));
	// 	console.log(result.ops[0]._id.getTimestamp());
	// });

	db.close();
});