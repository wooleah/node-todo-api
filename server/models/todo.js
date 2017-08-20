var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', { //mongoose adds todos collection to db
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true //cut white spaces both front and back
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

module.exports = {Todo}; 