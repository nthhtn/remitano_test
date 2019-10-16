import { ObjectID } from 'mongodb';

export default class UserModel {

	constructor(db) {
		this._db = db;
		this._table = 'user';
	}

	async create(data) {
		data._id = new ObjectID().toString();
		try {
			await this._db.collection(this._table).insertOne(data);
			return Promise.resolve(data);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async readByEmail(email) {
		try {
			return this._db.collection(this._table).findOne({ email });
		} catch (error) {
			return Promise.reject(error);
		}
	}

}
