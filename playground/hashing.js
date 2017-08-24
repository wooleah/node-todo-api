const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		//we wanna store hash value in db
// 		console.log(hash);
// 	});
// }); //async function (number of rounds, callback)

var hashedPassword = '$2a$10$MVxSrr1Q0hjkJqTjZyQIZe/f4sospkkYlMEoHnbt9pxu6MLc9rN6G';

bcrypt.compare(password, hashedPassword, (err, res) => {
	console.log(res);
});

// jwt.sign;
// jwt.verify;

// var data = {
// 	id: 10
// };

// var token = jwt.sign(data, 'aleah');
// // console.log(token);
// var decoded = jwt.verify(token, 'aleah');
// console.log('decoded', decoded);


// var message = "I am woojae";
// var hash =  SHA256(message).toString(); //returns object

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
// 	id: 4
// };
// var token = { //this is what we're going to send it back to user
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString() //hash value of data
// };

// //someone trying to manipulate the data-> doesn't know secret(salt) in the server
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// //checking if the token was manipulated
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if(resultHash === token.hash){
// 	console.log('Data was not changed');
// }else{
// 	console.log('Data was changed. Don\'t trust it');
// }