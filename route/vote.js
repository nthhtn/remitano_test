import express from 'express';
import { isLoggedIn } from '../lib/middleware';
import VoteModel from '../model/vote';

module.exports = (app, db) => {

	const router = express.Router();
	const Vote = new VoteModel(db);

	router.route('/')
		.post(isLoggedIn, async (req, res) => {
			const { videoId, value } = req.body;
			const data = { videoId, userId: req.session.user._id, value };
			try {
				const result = await Vote.upsert({ videoId }, data);
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(500).json({ success: true, error: error.message });
			}
		});

	app.use('/vote', router);

};
