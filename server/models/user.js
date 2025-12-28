const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePic: {
    type: String, // base64 string or URL
    default: ""
  },
  googleId: {
    type: String, // <-- added to support Google OAuth
    unique: true,
    sparse: true // allows null for users who don’t use Google login
  },
  wishlist: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Sell",
    default: []
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpiry: Date,
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Use email instead of username for local login
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);


