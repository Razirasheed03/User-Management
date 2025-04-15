const jwt = require('jsonwebtoken');

// Reusable helper to decode tokenssss
const decodeToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Middleware to verify regular tokenssss
const verifyToken = (req, res, next) => {
  try {
    const decoded = decodeToken(req);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

// Middleware to verify admin tokenssss
const verifyAdmin = (req, res, next) => {
  try {
    const decoded = decodeToken(req);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

module.exports = { verifyToken, verifyAdmin };
