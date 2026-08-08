const jwt = require('jsonwebtoken');

// AUTHENTICATION — "Who are you?"
exports.authenticate = (req, res, next) => {
  const header = req.headers.authorization;   // "Bearer eyJhbG..."
  const token =
    header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token)
    return res.status(401).json({ error: 'Authentication required' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],       // whitelist blocks alg-confusion attacks
      issuer: 'blogapp-api',
    });
    // req.user = { sub, name, role, iat, exp, iss }
    next();
  } catch (err) {
    return res.status(401).json({
      error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
    });
  }
};

// AUTHORIZATION — "Are you allowed?"
exports.authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (!allowedRoles.includes(req.user.role))
    return res.status(403).json({ error: 'Access denied: insufficient role' });
  next();
};