// Main application file that sets up the Express server
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const professorRoutes = require('./routes/professor');
const studentRoutes = require('./routes/student');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes and grant access from all domains
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/availability', professorRoutes);
app.use('/', studentRoutes);

// Server Setup
let server;
function startServer() {
  const port = process.env.PORT || 3000;
  server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  return server;
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Export both the app and server control functions
module.exports = { 
  app, 
  startServer, 
  closeServer: () => server?.close() 
};