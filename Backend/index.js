

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./user');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/anitfood").then(() => {
  console.log("MongoDB connected");
}).catch(err => console.log(err));

const JWT_SECRET = 'your_jwt_secret_key_change_in_prod'; // Change this!

app.get('/', (req, res) => {
  res.send("Food Delivery API is working!");
});

// Register
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, name, email }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Forgot Password (mock email)
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    // Mock: generate reset token
    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    // In prod, send email with nodemailer
    console.log('Reset token for', email, ':', resetToken);
    res.json({ message: 'Reset link sent to email (check console)' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset Password
app.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(400).json({ error: 'Invalid token' });
    user.password = password;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid/expired token' });
  }
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
