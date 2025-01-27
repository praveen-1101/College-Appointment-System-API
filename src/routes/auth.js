// Routes for user authentication (signup and login)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      role
    });
    
    // Save user to database
    await user.save();
    res.json({ message: 'Signup successful', user: { id: user._id, email: user.email, role: user.role } });
  } 
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Authenticates a user and returns a JWT token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'my-jwt-secret-token'
    );
     
    // Generate JWT token   
    res.json({ 
      message: 'Login successful', 
      token,
      userId: user._id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;