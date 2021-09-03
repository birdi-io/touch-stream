import GoogleAuth from 'google-auth-library';
import axios from 'axios';
import config from '../../config';
import { findOrCreateGoogle } from '../../api/user/controller';

const auth = new GoogleAuth();

function verifyGoogleToken(token) {
	const client = new auth.OAuth2(config.GOOGLE_CLIENT_ID);
	return new Promise((resolve, reject) => {
		client.verifyIdToken(
			token,
			config.GOOGLE_CLIENT_ID,
			(error, login) => {
				if (error) return reject(error);
				const payload = login.getPayload();
				return resolve(payload);
			},
		);
	});
}

async function googleCustomStrategy(req, done) {
	const { token } = req.body;
	if (!token) done(new Error('Token required'));
	// Verify
	let tokenData;
	try {
		tokenData = await verifyGoogleToken(token);
	} catch (err) {
		return done(err);
	}
	// Get detailed user info
	const { data: userData } = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
	const userObject = {
		name: userData.name || null,
		picture: userData.picture || null,
		googleId: userData.sub || tokenData.sub,
		email: userData.email || null,
		googleDomain: userData.hd || null,
	};
	// Input into database
	let returnedUser;
	try {
		returnedUser = await findOrCreateGoogle(userObject);
	} catch (err) {
		return done(err);
	}
	return done(null, returnedUser);
}

module.exports = {
	googleCustomStrategy,
};
