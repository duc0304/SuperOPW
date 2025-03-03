const { verifyToken } = require('../utils/jwt.utils');
const db = require('../models');
const User = db.User;
const { ApiError } = require('../utils/ApiError');

exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json(
        new ApiError(401, 'No token provided')
      );
    }
    
    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json(
        new ApiError(401, 'No token provided')
      );
    }
    
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json(
        new ApiError(404, 'User not found')
      );
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json(
      new ApiError(401, 'Unauthorized', [error.message])
    );
  }
};

// Kiểm tra quyền admin dựa trên email

