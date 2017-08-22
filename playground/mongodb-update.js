const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err)
		return console.log('Cannot connect to MondoDB server.');
	console.log('Connected');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('5994eb91b70f9427369b7260')}, 
	// 	{
	// 		$set: {completed: true}
	// 	}, {
	// 		returnOriginal: false
	// 	}).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5994e4bbb70f9427369b7143')
	}, {
		$set: {
			location: 'Hopkinsville'
		},
		$inc: {
			age: 1
		}
	}, {
		// returnOriginal: false
		returnNewDocument: true
	}).then((result) => {
		console.log(result);
	});

	db.close();
});