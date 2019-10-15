import chai from 'chai';
const expect = chai.expect;
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

	describe('hashPassword', () => {
		it('Return a string', () => {
			const randomString = generateRandomString();
			const result = hashPassword('123456789', randomString);
			return expect(result).to.be.a.string;
		})
	});

});
