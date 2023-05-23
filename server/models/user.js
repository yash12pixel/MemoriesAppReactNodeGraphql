import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password:{
      type: String,
      required: true
    },
    otpCode: {
      type: Number,
      default: 0,
    },
    otpCreateTime: {
      type: Date,
      default: Date.now,
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    token: {
      type: String,
    },
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);

export default User;
