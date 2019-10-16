import express from 'express';
import { isLoggedIn } from '../lib/auth';
import VoteModel from '../model/vote';
import VideoModel from '../model/video';

module.exports = (app, db) => {

	const router = express.Router();
	const Vote = new VoteModel(db);
	const Video = new VideoModel(db);

	router.route('/')
		.post(isLoggedIn, async (req, res) => {
			return res.json({ success: true });
		});

	app.use('/vote', router);

};
