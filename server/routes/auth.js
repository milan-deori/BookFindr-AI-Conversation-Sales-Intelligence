const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { email, name, password, profilePic } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "User already exists" });
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send OTP email
    const mailOptions = {
  from: "bookfindr205@gmail.com", // Your email address
  to: email,
  subject: "BookFinder - Email Verification Code",
  text: `Dear User,

Thank you for signing up with BookFindr! 

Your One-Time Password (OTP) is: ${otp}

Please enter this code to verify your email address. 
This code is valid for 10 minutes.

If you did not attempt to sign up, please ignore this message.

Best regards,  
The BookFinder Team`
};

    await transporter.sendMail(mailOptions);
    // Create a new user with the OTP and expiry

    // Register the user with passport-local-mongoose
    // Note: passport-local-mongoose will handle password hashing
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const newUser = new User({
      email,
      name,
      profilePic: profilePic || "",
      otp, // Store OTP
      otpExpiry // Store OTP expiry
    });

    await User.register(newUser, password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic || ""  // ✅ Include profilePic
        }
      });
    });
  })(req, res, next);
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-hash -salt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

