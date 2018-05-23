const mongoose = require('mongoose');
const crypto = require('crypto');

const eventUserMasterSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  birthDay: String,
  gender:{ type: String },
  tShirtSize:{ type: String },
  foodtype:String,
  jobRole:String,
  phone:{type: String},
  emailHash:{ type: String, unique: true }
}, { timestamps: true });


eventUserMasterSchema.methods.calculateEmailHash= function calculateEmailHash(email,cb){
 hash= crypto.createHash('md5').update(email).digest('hex');
 cb(hash);
 return hash;
};

eventUserMasterSchema.methods.compareEmailHash= function compareEmailHash(email,candidatehash,cb){
  isMatch= crypto.createHash('md5').update(email).digest('hex')==candidatehash;
  cb( isMatch);
  return isMatch;
};

const EventUserMaster = mongoose.model('EventUserMaster', eventUserMasterSchema);
module.exports = EventUserMaster;
