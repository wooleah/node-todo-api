const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err)
		return console.log('Unable to connect to MongoDB server.');
	console.log('Connected to MongoDB server.');

	//find methods returns a point to these documents(cursor)
	//toArray method returns a promise
	// db.collection('Todos').find({
	// 	_id: new ObjectID("5994c95f2d289f0393de91e9")
	// }).toArray().then((docs) => {
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err)=>{
	// 	console.log('Unable to fetch docs', err);
	// }); 

	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todo count: ${count}`);
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err);
	// });

	db.collection('Users').find({name: 'Woojae'}).toArray().then((docs) =>{
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err)=>{
		console.log('Error', err);
	});

	db.close();
});