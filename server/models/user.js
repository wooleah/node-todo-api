const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({//Schema property lets you define new schema
//add custom method here, can't add method to user
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true, //there is only one email property with this value
		//unique default is false -> can make more than one same emails
		validate: {
			// validator: (value) => {
			// 	return validator.isEmail(value);
			// },
			isAsync: false,
			validator: validator.isEmail, //it is a function and it'll return T/F
			message: '{VALUE} is not a valid email address!'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required:true
		}
	}]
});

//override
//toJSON method determines what gets send back when mongoose model is converted to json
UserSchema.methods.toJSON = function(){ 
	var user = this;
	var userObject = user.toObject(); //taking mongoose var(user) and converting it into a regular obj
	return _.pick(userObject, ['_id', 'email']); //we don't want password and token to return
};

//instance method added here
UserSchema.methods.generateAuthToken = function(){
	//arrow function do not bind this keyword, and we need this here
	//this keyword stores individual docs
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'aleah123').toString();

	user.tokens.push({access, token});
	//when generateAuthToken method is called in server.js
	//it will return a promise that returns token when resolved
	//and that token(return value) will be passed to the next then handler
	return user.save().then(() => { //return promise to chain promises with then method
		return token; 
	});
};

//you add model methods here
UserSchema.statics.findByToken = function(token){
	var User = this;
	var decoded;

	try{
		var decoded = jwt.verify(token, 'aleah123') // -> throw error if anything goes wrong
	}catch(e){
		// return new Promise((resolve, reject) => {
		// 	reject();
		// });
		return Promise.reject();
	}
	return User.findOne({
		_id: decoded._id,
		//to query a nested mongodb document, we need to wrap value in quotes
		'tokens.token': token, //quotes are required when we have .(dot) in a value
		'tokens.access': 'auth'
	}); //returns promise -> can chain then call
};

UserSchema.pre('save', function(next){
	var user = this;
	//check if the password is modified
	if(user.isModified('password')){
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				bcrypt.compare(user.password, hash, (err, result) => {
					if(result){
						user.password = hash;
						next();
					}
				});
			});
		});
	}else{
		next();
	}
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};