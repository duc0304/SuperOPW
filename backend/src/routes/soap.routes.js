const express = require('express');
const router = express.Router();
const soapService = require('../services/soap.service');

router.post('/createClient', async (req, res) => {
  try {
    console.log('Received request from frontend:', req.body);
    const result = await soapService.createClient(req.body);
    
    // Trả về kết quả có cấu trúc
    res.json(result);
  } catch (error) {
    console.error('Route Error:', error);
    res.status(500).json({
      success: false,
      retCode: '9999',
      message: error.message,
      details: error.response?.data
    });
  }
});

// Thêm route mới để xử lý tạo contract
router.post('/createContract', async (req, res) => {
  try {
    console.log('Received create contract request from frontend:', req.body);
    const result = await soapService.createContract(req.body);
    
    // Trả về kết quả có cấu trúc
    res.json(result);
  } catch (error) {
    console.error('Route Error:', error);
    res.status(500).json({
      success: false,
      retCode: '9999',
      message: error.message,
      details: error.response?.data
    });
  }
});

// Thêm route mới để xử lý tạo card
router.post('/createCard', async (req, res) => {
  try {
    console.log('Received create card request from frontend:', req.body);
    const result = await soapService.createCard(req.body);
    
    // Trả về kết quả có cấu trúc
    res.json(result);
  } catch (error) {
    console.error('Route Error:', error);
    res.status(500).json({
      success: false,
      retCode: '9999',
      message: error.message,
      details: error.response?.data
    });
  }
});

// Thêm route mới để xử lý tạo issuing contract
router.post('/createIssuingContract', async (req, res) => {
  try {
    console.log('Received create issuing contract request from frontend:', req.body);
    const result = await soapService.createIssuingContract(req.body);
    
    // Trả về kết quả có cấu trúc
    res.json(result);
  } catch (error) {
    console.error('Route Error:', error);
    res.status(500).json({
      success: false,
      retCode: '9999',
      message: error.message,
      details: error.response?.data
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports = router; 