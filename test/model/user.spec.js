import chai from 'chai';
const expect = chai.expect;
import chaiPromise from 'chai-as-promised';
chai.use(chaiPromise);
import { url, dbname } from '../../config/mongodb';
import { MongoClient } from 'mongodb';
import UserModel from '../../model/user';

const sample_user = {
	email: 'test@gmail.com',
	salt: '123456',
	password: '958D51602BBFBD18B2A084BA848A827C29952BFEF170C936419B0922994C0589'
};

describe('Test User model', () => {

	let User;
	let db;
	let client;
	let connected = true;

	const connect = () => new Promise(async (resolve, reject) => {
		try {
			client = await MongoClient.connect(url);
			db = await client.db(dbname);
			User = new UserModel(db);
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
			return User.create(sample_user).then(
				(result) => {
					expect(result._id).to.be.a('string');
					expect(result.email).to.equal(sample_user.email);
					expect(result.salt).to.equal(sample_user.salt);
					expect(result.password).to.equal(sample_user.password);
					id = result._id;
				});
		});
		it('Should fail due to duplicate email', () => {
			return User.create(sample_user).then(
				(result) => {
					id = result._id;
					return expect(User.create(sample_user)).to.be.rejected;
				});
		});
		it('Should fail due to lost connection', () => {
			return client.close(true).then(() => {
				connected = false;
				return expect(User.create(sample_user)).to.be.rejected;
			});
		});
		afterEach(async () => {
			(!connected && await connect());
			return db.collection('user').findOneAndDelete({ _id: id });
		});
	});

	describe('readByEmail', () => {
		let id;
		beforeEach(async () => {
			(!connected && await connect());
			const result = await User.create(sample_user);
			id = result._id;
		});
		it('Should return an inserted document', () => {
			return User.readByEmail(sample_user.email).then(
				(result) => {
					expect(result._id).to.be.a('string');
					expect(result.email).to.equal(sample_user.email);
					expect(result.salt).to.equal(sample_user.salt);
					expect(result.password).to.equal(sample_user.password);
					id = result._id;
				});
		});
		it('Should fail due to lost connection', () => {
			return client.close(true).then(() => {
				connected = false;
				return expect(User.readByEmail(sample_user.email)).to.be.rejected;
			});
		});
		afterEach(async () => {
			(!connected && await connect());
			return db.collection('user').findOneAndDelete({ _id: id });
		});
	});

});
