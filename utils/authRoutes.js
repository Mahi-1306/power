const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendOTPEmail,  verifyOTP} = require('./mail')
const verifyToken = require('../middleware/verifyToken')
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = 'qwertyuiop@1234';

// 👉 Register Route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 👉 Login Route

// ratelimiter --> window time , count
/*router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        user.token = token
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});*/

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    const payload = jwt.verify(token, JWT_SECRET);
   console.log('Payload:', payload);
    res.json({ token, payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/me', verifyToken, (req, res) => {
  res.json({ payload: req.user });
});

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const token = await sendOTPEmail(email);
        res.status(200).json({ message: 'OTP sent successfully', token });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

router.post('/verify-otp', async(req, res) => {
    const { token, otp } = req.body;

    if (!token || !otp) {
        return res.status(400).json({ error: 'Token and OTP are required' });
    }

    const isValid = verifyOTP(token, otp);
    if (isValid) {
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(401).json({ error: 'Invalid or expired OTP' });
    }
});

router.put('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (!verifiedOTPs.has(token)) {
        return res.status(403).json({ error: 'OTP not verified or expired' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await updateUserPassword(token, hashedPassword); 
        verifiedOTPs.delete(token);

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update password' });
    }
});
module.exports = router;
