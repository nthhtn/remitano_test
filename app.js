import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import mongo_url from './config/mongodb';
import { MongoClient } from 'mongodb';

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

MongoClient.connect(mongo_url, async (err, client) => {
	if (err) { throw err; }

});

const string = 'mongodb+srv://thehien115:nthhtn@cluster0-ff5su.mongodb.net/test?retryWrites=true&w=majority';
const api_key = 'AIzaSyByd8tBvOc32IYHLNssOewwesqohRWhqPs';
const client_id = '700740834863-9q8a0h7bvl1otv5p87c38rll5991fsn7.apps.googleusercontent.com';
const client_secret = 'ML5EgEcYXNXkQ82vTftsWH5X';
