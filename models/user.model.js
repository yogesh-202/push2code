import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  cfid: {
    type: String,
   
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: String,
  otpExpiry: Date
}, {
  timestamps: true
});

// Ensure the model is only compiled once in development to avoid overwrite errors
const User = mongoose.models?.User || mongoose.model('User', userSchema);

export default User;
