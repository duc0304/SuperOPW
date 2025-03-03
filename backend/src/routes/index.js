const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const customerRoutes = require('./customer.routes');

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

module.exports = router; 