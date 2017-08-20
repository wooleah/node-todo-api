const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


//Todo.remove({}) //remove everything, Todo.remove() doesn't work

// Todo.remove({}).then((result) => { //you only get how many docs were removed, not objects(removed docs)
// 	console.log(result);
// });

// Todo.findOneAndRemove().then((result) => { //this will return the removed doc, so you can do sth with tha removed doc

// });

Todo.findOneAndRemove({_id: '5999babbf00f7caeafb7ad75'}).then((todo) => {

});

// Todo.findByIdAndRemove('5999babbf00f7caeafb7ad75').then((todo) => {
// 	console.log(todo); //returns removed doc(object) as well
// });