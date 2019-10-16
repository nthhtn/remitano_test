import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../lib/auth';
import UserModel from '../model/user';

module.exports = (app, db) => {

	const router = express.Router();
	const User = new UserModel(db);

	router.route('/login')
		.post(isNotLoggedIn, async (req, res) => {
			
		});

	router.route('/')
		.get(async (req, res) => {
			return res.render('base', { user: req.session.user || null });
		});

	app.use(router);

};
