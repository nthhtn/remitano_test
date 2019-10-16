import { ObjectID } from 'mongodb';

export default class VideoModel {

	constructor(db) {
		this._db = db;
		this._table = 'video';
	}

	async create(data) {
		data._id = new ObjectID().toString();
		data.createdAt = Date.now();
		try {
			await this._db.collection(this._table).insertOne(data);
			return Promise.resolve(data);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async queryByFields(filter_options = {}) {
		try {
			return await this._db.collection(this._table).find(filter_options).sort({ createdAt: -1 }).toArray();
		} catch (error) {
			return Promise.reject(error);
		}
	}

}
