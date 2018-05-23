const mongoose = require('mongoose');

const regDataSchema = new mongoose.Schema({
  email: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('regData', regDataSchema);
