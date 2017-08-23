var env = process.env.NODE_ENV || 'development';
//process.env can be accessed globally

if(env === 'development'){
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}else if(env === 'test'){
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

//in heroku, env string is set to 'production'