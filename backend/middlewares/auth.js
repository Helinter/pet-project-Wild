require('dotenv').config();

const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const UnauthorizedError = require('./UnauthorizedError');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token is missing or invalid'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : '7e48151e23b2943091c18f0e3e6e0c6c625f514b47d726c773a39df19eac1e0e');
    req.user = payload;
    return next();
  } catch (error) {
    console.error('Verification error:', error.message);
    return next(new UnauthorizedError('Invalid token'));
  }
};

module.exports = { authMiddleware };
