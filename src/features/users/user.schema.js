import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  googleId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  isExpireOtp: {
    type: Date,
  },
});

export default userSchema;
