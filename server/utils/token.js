const jwt = require('jsonwebtoken');

exports.signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,       // subject = MySQL users.id → the identity bridge
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      issuer: 'blogapp-api',
    }
  );