export default class VoteModel {

	constructor(db) {
		this._db = db;
		this._table = 'vote';
	}

	async create(data) {
		try {
			await this._db.collection(this._table).createIndex({ videoId: 1, userId: 1 }, { unique: 1 });
			await this._db.collection(this._table).insertOne(data);
			return Promise.resolve(data);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async update(id, data) {
		try {
			const result = await this._db.collection(this._table).findOneAndUpdate({ _id: id }, { $set: data }, { returnOriginal: false });
			return Promise.resolve(result.value);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async upsert(filter_options, data) {
		try {
			await this._db.collection(this._table).createIndex({ videoId: 1, userId: 1 }, { unique: 1 });
			const result = await this._db.collection(this._table).findOneAndUpdate(filter_options, { $set: data }, { upsert: true, returnOriginal: false });
			return Promise.resolve(result.value);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async getOneUserVote(videoId, userId) {
		try {
			const result = await this._db.collection(this._table).findOne({ videoId, userId });
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error);
		}
	}

}
