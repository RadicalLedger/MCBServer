const mongoose = require('mongoose');

const gameDataSchema = new mongoose.Schema({
  fromUportId: { type: String},
  toUportId: { type: String},
  transactionHash: { type: String},
  tnxStatus:{type: Boolean, default: false},
  fromAddress: { type: String},
  toAddress: { type: String},
  lastAttemptedOn:Date,
  processingStatus:{type: Boolean, default: false},
  transactionLog: [],
}, { timestamps: true });
gameDataSchema.index({ fromUportId: 1, toUportId: 1 }, { unique: true })

module.exports = mongoose.model('GameData', gameDataSchema);
