import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../lib/auth';
import UserModel from '../model/user';
import VideoModel from '../model/video';
import { generateRandomString, hashPassword } from '../lib/password';
import to from 'await-to-js';

module.exports = (app, db) => {

	const router = express.Router();
	const User = new UserModel(db);
	const Video = new VideoModel(db);

	router.route('/login')
		.post(isNotLoggedIn, async (req, res) => {
			const { email, password } = req.body;
			let [err, result] = await to(User.readByEmail(email));
			if (err) { return res.status(500).json({ success: false, error: err.message }); }
			if (result) {
				const hashed = hashPassword(password, result.salt);
				if (hashed === result.password) {
					req.session.user = { _id: result._id, email };
					return res.json({ success: true });
				}
				return res.status(401).json({ success: false, error: 'Wrong password' });
			}
			const salt = generateRandomString();
			const hashedPassword = hashPassword(password, salt);
			[err, result] = await to(User.create({ email, salt, password: hashedPassword }));
			if (err) { return res.status(500).json({ success: false, error: err.message }); }
			req.session.user = { _id: result._id, email };
			return res.json({ success: true });
		});

	router.route('/logout')
		.post(isLoggedIn, (req, res) => {
			return req.session.destroy((err) => {
				return err ? res.status(500).json({ success: false, error: err.message }) : res.json({ success: true });
			});
		});

	router.route('/')
		.get(async (req, res) => {
			return res.render('base', { user: req.session.user || undefined });
		});

	app.use(router);

};
