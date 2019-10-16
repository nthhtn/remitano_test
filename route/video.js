import express from 'express';
import { isLoggedIn } from '../lib/auth';
import VideoModel from '../model/video';

module.exports = (app, db) => {

	const router = express.Router();
	const Video = new VideoModel(db);

	router.route('/')
		.post(isLoggedIn, async (req, res) => {
			const data = {
				url: req.body.url,
				youtubeId: req.body.youtubeId,
				userId: req.session.user._id
			};
			try {
				const result = await Video.create(data);
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(500).json({ success: true, error: error.message });
			}
		});

	app.use('/video', router);

};
