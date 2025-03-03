const db = require('../models');
const User = db.User;
const { generateToken } = require('../utils/jwt.utils');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');

// Đăng ký người dùng mới
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json(
        new ApiError(400, 'All fields are required')
      );
    }

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json(
        new ApiError(400, 'Email already in use')
      );
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json(
        new ApiError(400, 'Username already in use')
      );
    }

    // Tạo người dùng mới (không mã hóa mật khẩu)
    const newUser = await User.create({
      username,
      email,
      password // Lưu mật khẩu dạng plain text
    });

    // Tạo token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email
    });

    // Trả về thông tin người dùng và token
    return res.status(201).json(
      new ApiResponse(201, {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        },
        token
      }, 'User registered successfully')
    );
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json(
      new ApiError(500, 'Registration failed', [error.message])
    );
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json(
        new ApiError(400, 'Email and password are required')
      );
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json(
        new ApiError(401, 'Invalid email or password')
      );
    }

    // Kiểm tra mật khẩu (so sánh trực tiếp)
    if (user.password !== password) {
      return res.status(401).json(
        new ApiError(401, 'Invalid email or password')
      );
    }

    // Tạo token
    const token = generateToken({
      id: user.id,
      email: user.email
    });

    // Trả về thông tin người dùng và token
    return res.status(200).json(
      new ApiResponse(200, {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }, 'Login successful')
    );
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json(
      new ApiError(500, 'Login failed', [error.message])
    );
  }
};

// Lấy thông tin người dùng hiện tại
exports.getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json(
      new ApiResponse(200, {
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email
        }
      }, 'User info retrieved successfully')
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to get user info', [error.message])
    );
  }
};

// Đăng xuất - phía client sẽ xóa token
exports.logout = (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, {}, 'Logout successful')
  );
}; 