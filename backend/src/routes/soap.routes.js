const express = require('express');
const router = express.Router();
const soapService = require('../services/soap.service');

router.post('/createClient', async (req, res) => {
  try {
    console.log('Received request from frontend:', req.body);
    const result = await soapService.createClient(req.body);
    res.json(result);
  } catch (error) {
    console.error('Route Error:', error);
    res.status(500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports = router; 