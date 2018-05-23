const mongoose = require('mongoose');

const challengeDataScheme = new mongoose.Schema({
  userName: {type:String, required:true},
  userEmail: String,
  challengeID: String,
  completedDate: String
}, {timestamps: true });

module.exports = mongoose.model('challengeData', challengeDataScheme);
