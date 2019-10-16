import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import { url, dbname } from './config/mongodb';
import { MongoClient } from 'mongodb';

import port from './config/port';

var app = express();

app.use(session({
	secret: 'remitano',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/static`));

app.set('view engine', 'ejs');
app.set('views', './view');

MongoClient.connect(url, async (err, client) => {
	if (err) { throw err; }
	const db = await client.db(dbname);
	require('./route/index')(app, db);
	app.listen(port, () => console.log(`Small project is listening on port ${port}`));
});
