import chai from 'chai';
const expect = chai.expect;
import chaiPromise from 'chai-as-promised';
chai.use(chaiPromise);
import { url, dbname } from '../../config/mongodb';
import { MongoClient, ObjectID } from 'mongodb';
import VideoModel from '../../model/video';

const sample_video = {
	url: 'https://www.youtube.com/watch?v=xa45wXhc5zg',
	userId: 'user_1'
};

describe('Test Video model', () => {

	let Video;
	let db;
	let client;
	let connected = true;

	const connect = () => new Promise(async (resolve, reject) => {
		try {
			client = await MongoClient.connect(url);
			db = await client.db(dbname);
			Video = new VideoModel(db);
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
			return Video.create(sample_video).then(
				(result) => {
					expect(result._id).to.be.a('string');
					expect(result.url).to.equal(sample_video.url);
					expect(result.userId).to.equal(sample_video.userId);
					id = result._id;
				});
		});
		it('Should fail due to lost connection', () => {
			return client.close(true).then(() => {
				connected = false;
				return expect(Video.create(sample_video)).to.be.rejected;
			});
		});
		afterEach(async () => {
			(!connected && await connect());
			return db.collection('video').findOneAndDelete({ _id: id });
		});
	});

	describe('queryByFields', () => {
		beforeEach(async () => {
			(!connected && await connect());
			let array = [];
			for (let i = 1; i <= 10; i++) {
				const item = {
					_id: new ObjectID().toString(),
					url: 'url_' + i.toString(),
					userId: 'user_' + (i / 2).toString()
				};
				array.push(item);
			}
			return db.collection('video').insertMany(array);
		});
		it('Should return all documents', () => {
			return Video.queryByFields().then(
				(result) => {
					expect(result.length).to.equal(10);
				});
		});
		it('Should return all documents with userId = "user_0"', () => {
			return Video.queryByFields({ userId: 'user_0' }).then(
				(result) => {
					result.map((item) => expect(item.userId).to.equal('user_0'));
				});
		});
		it('Should fail due to lost connection', () => {
			return client.close(true).then(() => {
				connected = false;
				return expect(Video.queryByFields()).to.be.rejected;
			});
		});
		afterEach(async () => {
			(!connected && await connect());
			return db.collection('video').deleteMany({});
		});
	});

});
