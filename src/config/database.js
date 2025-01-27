// This file handles the MongoDB connection setup
const mongoose = require('mongoose');

const connectDB = async () => {
  try 
  {
    // Connect to MongoDB using environment variable or default connection string
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://borapraveen1101:BackendAPI@cluster0.6kh66.mongodb.net/?retryWrites=true&w=majority&appName=cluster0');
    console.log('MongoDB connected successfully');
  } 
  catch (error) 
  {
    // If connection fails, log error and exit process
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;