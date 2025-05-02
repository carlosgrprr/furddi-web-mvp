const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { isTestMode } = require('../server'); // Import test mode flag

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Configure nodemailer with Ethereal for testing
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'your-ethereal-username', // Replace with Ethereal username
    pass: 'your-ethereal-password', // Replace with Ethereal password
  },
});

// User registration with email verification
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Incoming registration request:', { name, email, role }); // Debug log

    console.log('Executing duplicate email check for email:', email); // Debug log
    const existingUser = await User.findOne({ email });
    console.log('Duplicate email check result:', existingUser ? existingUser.email : 'No user found'); // Debug log

    if (existingUser) {
      console.log('Duplicate email detected:', email); // Debug log
      return res.status(400).send('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully'); // Debug log

    const user = new User({ name, email, password: hashedPassword, role });
    console.log('User object created:', user); // Debug log

    await user.save();
    console.log('User saved to database'); // Debug log

    console.log('isTestMode value:', isTestMode); // Debug log to confirm test mode status
    if (isTestMode) {
      console.log('Mocking email sending in test mode'); // Debug log
      return res.status(201).send('User registered successfully');
    }

    const verificationLink = `http://localhost:3000/api/users/verify?email=${email}`;
    console.log('Verification link generated:', verificationLink); // Debug log

    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Verify your email',
      text: `Click the link to verify your email: ${verificationLink}`,
    });
    console.log('Verification email sent'); // Debug log

    res.status(201).send('User registered successfully. Please verify your email.');
  } catch (error) {
    console.error('Error during registration process:', error); // Debug log
    res.status(400).send(error.message);
  }
});

// Email verification route
router.get('/verify', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.isVerified = true;
    await user.save();
    res.send('Email verified successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Attempting login with email:', email); // Debug log

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email); // Debug log
      return res.status(401).send('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid); // Debug log

    if (!isPasswordValid) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, generated token:', token); // Debug log

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error); // Debug log
    res.status(500).send(error.message);
  }
});

// Password reset request
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    console.log('isTestMode value:', isTestMode); // Debug log to confirm test mode status
    if (isTestMode) {
      console.log('Test mode active, skipping email sending'); // Debug log
      return res.send('Password reset email sent');
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:3000/api/users/reset-password/${resetToken}`;

    // Send reset email
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.send('Password reset email sent');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Password reset
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send('Password reset successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;