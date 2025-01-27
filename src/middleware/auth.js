// Authentication middleware to verify JWT tokens
const jwt = require('jsonwebtoken');

//Checks if the request has a valid authorization token
const auth = async (req, res, next) => {
  try {
    // Get token from header and remove 'Bearer ' prefix
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required' });
    }
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-jwt-secret-token');
    
    req.user = decoded;
    next();
  } 
  catch (error) 
  {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth;