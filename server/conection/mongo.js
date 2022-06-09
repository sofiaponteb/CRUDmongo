'use strict';

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// user set constiables
// user set constiables
const mongoURL = process.env.MONGO_URL || '172.17.61.223';
const mongoUser = process.env.MONGO_USER || 'admin';
const mongoPass = process.env.MONGO_PASS || 'very-secret';
const mongoDBName = process.env.MONGO_DB_NAME || 'admin';

module.exports = function(app){

	// set up other middleware
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	  });

	const options = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		poolSize: 1,
		reconnectTries: 1
	};

	// connect to the MongoDB
	let mongoConnect = 'mongodb://127.0.0.1:27017';
	if (mongoURL !== '' && mongoUser !== '' && mongoPass != '') {
  		mongoConnect = `mongodb://${mongoUser}:${mongoPass}@${mongoURL}:27017/${mongoDBName}`;
	} else if (mongoURL !== '') {
  		mongoConnect = `mongodb://${mongoURL}/${mongoDBName}`;
	}

	mongoose.Promise = global.Promise;
	mongoose.connect(mongoConnect, options)
  		.catch((err) => {
    		if (err) console.error(err);
  	});

	var db = mongoose.connection;
	db.on('error', (error) => {
        console.error(error);
	});

	var sess = {
	  store: new MongoStore({ mongooseConnection: mongoose.connection }),
	  name: 'mean example',
	  secret: 'ninpocho',
	  resave: false,
	  saveUninitialized: true,
	  cookie: {}
	};

	app.use(session(sess));

	console.info('Connection established with mongodb');
	console.info(`Connection details: ${mongoConnect}`);
};

