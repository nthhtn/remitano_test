import express from 'express';

module.exports = (app, db) => {

	const router = express.Router();

	router.route('/')
		.get(async (req, res) => {
			return res.render('base');
		});

	app.use(router);

};
