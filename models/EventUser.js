const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');


const eventUserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  emailHash: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  uportId: String,
  birthDay: Date,
  isDeployed : {
    type: Boolean,
    default: false
  },
  gender:{ type: String, min: 1, max: 1 },
  tShirtSize:{ type: String, min: 1, max: 4 },
  foodtype:String,
  userCategory:String,
  mobile: String,
  contractHash: String,
  contractAddress: String,
  tokenBalance:{ type: Number, default: 0.0 },
  gameTokenBalance:{ type: Number, default: 0.0 },
  claimedTokens:{
    enterToken:{ status:{type: Number, default: -2},lastAttemptedOn:Date },
    tshirtToken:{ status:{type: Number, default: -2},lastAttemptedOn:Date },
    registerToken:{ status:{type: Number, default: -2},lastAttemptedOn:Date },
    foodToken:{ status:{type: Number, default: -2},lastAttemptedOn:Date }
  },
  isEntered : {
        type: Boolean,
        default: false
    },
  hasShirt: {
        type: Boolean,
        default: false
    },
  hasFood : {
        type: Boolean,
        default: false
    },
  phone: 
  {
	type: String,
	validate: {
	  validator: function(v) {
		return /\d{9}/.test(v);
	  },
	  message: '{VALUE} is not a valid phone number!'
	}
  }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
eventUserSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
eventUserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};


eventUserSchema.methods.calculateEmailHash= function calculateEmailHash(email,cb){
  hash= crypto.createHash('md5').update(email).digest('hex');
  cb(hash);
  return hash;
 };
 
 eventUserSchema.methods.compareEmailHash= function compareEmailHash(email,candidatehash,cb){
   isMatch= crypto.createHash('md5').update(email).digest('hex')==candidatehash;
   cb( isMatch);
   return isMatch;
 };

const EventUser = mongoose.model('EventUser', eventUserSchema);

module.exports = EventUser;
