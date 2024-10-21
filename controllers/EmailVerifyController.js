const crypto = require('crypto');
const User = require('../models/UserModel');
const Otp = require('../models/OtpModel');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require("bcrypt");


const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    await Otp.create({ userId: user._id, otp });

    await sendEmail(email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}`);

    res.status(200).json({ message: 'OTP sent to your email address' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpRecord = await Otp.findOne({ userId: user._id, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

  
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(404).json({ message: "User not found" });
    }
    const userId = user._id;


    const otpRecord = await Otp.findOne({ userId, otp });
    if (!otpRecord) {
      console.log("Invalid or expired OTP");
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteOne({ _id: otpRecord._id });
 
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }

  } catch (error) {
    console.error("Error in resetPassword function:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  sendOtp,
  verifyOtp,
  resetPassword,
};
