const mongoose = require('mongoose');

const challengeDataScheme = new mongoose.Schema({
  userName: String,
  userEmail: String,
  challengeID: String,
  files: String,
  completedDate: String
}, {timestamps: true });

module.exports = mongoose.model('challengeData', challengeDataScheme);
