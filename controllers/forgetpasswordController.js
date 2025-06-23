const User = require('../models/UserData');
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');

const OTPMap = new Map(); // In-memory store

exports.sendResetOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

  OTPMap.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 min

  await mailSender(email, "🔐 Reset Your Password", `Your OTP: ${otp}`);
  res.json({ success: true, message: 'OTP sent to email' });
};



exports.verifyOtpAndReset = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const stored = OTPMap.get(email);

  if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  // ✅ Ensure password gets hashed
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;

  await user.save();
  OTPMap.delete(email);

  res.json({ success: true, message: 'Password reset successful' });
};
