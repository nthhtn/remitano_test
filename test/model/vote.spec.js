import chai from 'chai';
const expect = chai.expect;
import chaiPromise from 'chai-as-promised';
chai.use(chaiPromise);
import { url, dbname } from '../../config/mongodb';
import { MongoClient } from 'mongodb';
import VoteModel from '../../model/vote';

const sample_vote = {
	videoId: 'video_1',
	userId: 'user_1',
	value: 'like'
};

describe('Test Vote model', () => {

	let Vote;
	let db;
	let client;
	let connected = true;

	const connect = () => new Promise(async (resolve, reject) => {
		try {
			client = await MongoClient.connect(url);
			db = await client.db(dbname);
			Vote = new VoteModel(db);
			connected = true;
			resolve();
		} catch (error) {
			return reject(error);
		}
	});

	before(() => connect());

	describe('create', () => {
		let id;
		beforeEach(async () => {
			return (!connected && connect());
		});
		it('Should return an inserted document', () => {
			return Vote.create(sample_vote).then(
				(result) => {
					expect(result._id).to.be.a('string');
					expect(result.videoId).to.equal(sample_vote.videoId);
					expect(result.userId).to.equal(sample_vote.userId);
					expect(result.value).to.equal(sample_vote.value);
					id = result._id;
				});
		});
		it('Should fail due to lost connection', () => {
			return client.close(true).then(() => {
				connected = false;
				return expect(Vote.create(sample_vote)).to.be.rejected;
			});
		});
		afterEach(async () => {
			(!connected && await connect());
			return db.collection('vote').findOneAndDelete({ _id: id });
		});
	});

	describe('update', () => {
		let id;
		beforeEach(async () => {
			(!connected && await connect());
			const result = await Vote.create(sample_vote);
			id = result._id;
		});
		it('Should return an updated document', () => {
			return Vote.update(id, { value: 'dislike' }).then(
				(result) => {
					expect(result._id).to.be.a('string');
					expect(result.videoId).to.equal(sample_vote.videoId);
					expect(result.userId).to.equal(sample_vote.userId);
					expect(result.value).to.equal('dislike');
				});
		});
		it('Should fail due to lost connection', () => {
			return client.close(true).then(() => {
				connected = false;
				return expect(Vote.update(id, { value: 'dislike' })).to.be.rejected;
			});
		});
		afterEach(async () => {
			(!connected && await connect());
			return db.collection('vote').findOneAndDelete({ _id: id });
		});
	});

});
