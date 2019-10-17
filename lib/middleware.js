module.exports = {
	isLoggedIn: (req, res, next) => {
		return req.session.user ? next() : res.status(401).json({ success: false, result: 'Invalid session' });
	},
	isNotLoggedIn: (req, res, next) => {
		return !req.session.user ? next() : res.status(401).json({ success: false, result: 'Invalid session' });
	}
};
