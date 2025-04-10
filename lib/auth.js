import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

/**
 * Verify JWT token
 * @param {string} token - The JWT token to verify
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  if (!token) {
    return null;
  }
  
  try {
    return verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Authorization middleware for API routes
 * @param {function} handler - The API route handler
 * @returns {function} - Middleware function
 */
export function withAuth(handler) {
  return async (req, res) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);
      
      if (!payload) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      // Add user info to request
      req.user = payload;
      
      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
