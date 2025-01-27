// Schema definition for User model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Email field
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // Password field - will store hashed password
  password: { 
    type: String, 
    required: true 
  },
  // Role field - either 'student' or 'professor'
  role: { 
    type: String, 
    required: true, 
    enum: ['student', 'professor'] 
  },
  // Timestamp for when the user was created
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);