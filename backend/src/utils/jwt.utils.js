const jwt = require('jsonwebtoken');

// Sử dụng một secret key đơn giản
const SECRET_KEY = 'your-secret-key';

exports.generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid token');
  }
}; 