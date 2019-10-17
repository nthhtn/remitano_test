import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../lib/auth';
import UserModel from '../model/user';
import VideoModel from '../model/video';
import VoteModel from '../model/vote';
import { generateRandomString, hashPassword } from '../lib/password';
import to from 'await-to-js';
import { apikey } from '../config/youtube';
import axios from 'axios';
import Promise from 'bluebird';

module.exports = (app, db) => {

	const router = express.Router();
	const User = new UserModel(db);
	const Video = new VideoModel(db);
	const Vote = new VoteModel(db);

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
			const { user } = req.session;
			let videos = await Video.lookup({});
			await Promise.map(videos, async (item, i) => {
				item.likes = item.votes.filter((vote) => vote.value === 'like').length;
				item.dislikes = item.votes.filter((vote) => vote.value === 'dislike').length;
				if (user) {
					const myvote = await Vote.getOneUserVote(item._id, user._id);
					item.myvote = myvote ? myvote.value : 'none';
				}
				delete item.votes;
				item.sharer = item.sharer.email;
				const youtubeVideo = await axios({
					url: `https://www.googleapis.com/youtube/v3/videos`,
					method: 'GET',
					params: { key: apikey, part: 'snippet', id: item.youtubeId }
				}).then((response) => (response.data));
				item.title = youtubeVideo.items[0] ? youtubeVideo.items[0].snippet.title : '';
				item.description = youtubeVideo.items[0] ? youtubeVideo.items[0].snippet.description : '';
				videos[i] = item;
			});
			return res.render('base', { videos, user });
		});

	app.use(router);

};
