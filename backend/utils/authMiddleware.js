const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Load JWT secret from environment variables

// Middleware to verify JWT tokens
function authenticateToken(req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    req.user = { id: 'mockUserId' }; // Mock user object for testing
    return next();
  }

  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Attach user info to request object
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
  }
}

module.exports = { authenticateToken };