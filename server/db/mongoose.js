var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

module.exports = {
	// mongoose: mongoose;
	mongoose //can be simplified if property and var name is same
};

// process.env.NODE_ENV === 'production'