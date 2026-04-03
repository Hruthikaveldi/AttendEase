// ═══════════════════════════════════
//   ATTENDEASE — middleware/auth.js
//   Protects routes — checks JWT token
// ═══════════════════════════════════
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Token comes in header: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
