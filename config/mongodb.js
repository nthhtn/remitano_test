require('dotenv').config();

module.exports = {
	url: process.env.MONGO_URL,
	dbname: process.env.MONGO_DBNAME
};
