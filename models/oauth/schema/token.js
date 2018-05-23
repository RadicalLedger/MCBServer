var userSchema = require('./apiuser');

module.exports = {
	accessToken: String,
	expires: Date,
	clientId: String,
	user: userSchema
};
