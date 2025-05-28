const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTPEmail(toEmail) {
  const otp = generateOTP();
  const token = jwt.sign({ otp }, JWT_SECRET, { expiresIn: "5m" });

  const mailOptions = {
    from: `"POWER CONSUMPTION TRACKER OTP" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Code",
    html: `
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  return token;
}

function verifyOTP(token, inputOtp) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.otp === inputOtp;
  } catch (err) {
    return false;
  }
}

module.exports = { sendOTPEmail, verifyOTP };
