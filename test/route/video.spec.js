// import chai from 'chai';
// const expect = chai.expect;
// import chaiPromise from 'chai-as-promised';
// import chaiHttp from 'chai-http';
// chai.use(chaiPromise);
// chai.use(chaiHttp);
// import mockSession from 'mock-session';
// import { url, dbname } from '../../config/mongodb';
// import { MongoClient, ObjectID } from 'mongodb';
// import VideoModel from '../../model/video';
// import app from '../../app';

// const sample_video = {
// 	url: 'https://www.youtube.com/watch?v=xa45wXhc5zg',
// 	youtubeId: 'xa45wXhc5zg',
// 	userId: 'user_1'
// };
// const cookie = mockSession('my-session', 'remitano', { user: { _id: 'user_1' } });

// describe('Test /video route', async () => {

// 	let db, Video;

// 	before((done) => {
// 		MongoClient.connect(url, async (err, client) => {
// 			if (err) { throw err; }
// 			db = await client.db(dbname);
// 			Video = new VideoModel(db);
// 			return done();
// 		})
// 	});

// 	describe('/', () => {
// 		describe('POST', () => {
// 			let id;
// 			it('Should return 200 if successful', (done) => {
// 				chai.request(app)
// 					.post('/video')
// 					.set('cookie', [cookie])
// 					.end((err, res) => {
// 						expect(res.status).to.equal(200);
// 						expect(res.body.success).to.equal(true);
// 						id = res.body.result._id
// 						expect(res.body.result.url).to.equal(sample_video.url);
// 						expect(res.body.result.youtubeId).to.equal(sample_video.youtubeId);
// 						expect(res.body.result.userId).to.equal(sample_video.userId);
// 						expect(res.body.result.createdAt).to.be.a('number');
// 						return done();
// 					});
// 			});
// 			it('Should return 401 if there is no session', (done) => {
// 				chai.request(app)
// 					.post('/video')
// 					.end((err, res) => {
// 						expect(res.status).to.equal(403);
// 						expect(res.body.success).to.equal(false);
// 						expect(res.body.error.message).to.equal('Invalid session');
// 						return done();
// 					});
// 			});
// 			afterEach(() => db.collection('video').findOneAndDelete({ _id: id }));
// 		});
// 	});

// });
