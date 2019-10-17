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

	async lookup(filter_options = {}) {
		try {
			const aggregate = [
				{ $project: { _id: 1, url: 1, youtubeId: 1, userId: 1 } },
				{ $match: filter_options },
				{ $sort: { createdAt: -1 } },
				{
					$lookup: {
						from: 'vote',
						localField: '_id',
						foreignField: 'videoId',
						as: 'votes'
					}
				},
				{
					$lookup: {
						from: 'user',
						localField: 'userId',
						foreignField: '_id',
						as: 'sharer'
					}
				},
				{
					$unwind: { path: '$sharer', preserveNullAndEmptyArrays: true }
				}
			];
			return await this._db.collection(this._table).aggregate(aggregate).toArray();
		} catch (error) {
			return Promise.reject(error);
		}
	}

}
