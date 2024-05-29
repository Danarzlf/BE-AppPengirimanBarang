const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  otp: String,
  otpCreatedAt: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User',
  },
  resetPasswordToken: String,
  googleId: String,
  userProfile: { type: Schema.Types.ObjectId, ref: 'UserProfile' }, // reference to UserProfile
});

const User = mongoose.model('User', userSchema);

module.exports = User;
