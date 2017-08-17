var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});

module.exports = {
	// mongoose: mongoose;
	mongoose //can be simplified if property and var name is same
};