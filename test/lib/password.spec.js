import chai from 'chai';
const expect = chai.expect;
import chaiPromise from 'chai-as-promised';
chai.use(chaiPromise);
import { generateRandomString, hashPassword } from '../../lib/password';

describe('Test lib password', () => {

	describe('generateRandomString', () => {
		it('No input, length = 15', () => {
			const randomString = generateRandomString();
			return expect(randomString).to.have.length(15);
		});
		it('length = 10', () => {
			const randomString = generateRandomString(10);
			return expect(randomString).to.have.length(10);
		});
	});

});
