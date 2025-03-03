const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateCustomerCreation, validateCustomerUpdate } = require('../middlewares/customer.middleware');

// Apply authentication middleware to all customer routes
router.use(authenticateToken);

// Get customer statistics
router.get('/stats', customerController.getCustomerStats);

// Get all customers with pagination, search and filter
router.get('/', customerController.getAllCustomers);

// Get customer by ID
router.get('/:id', customerController.getCustomerById);

// Create a new customer
router.post('/', validateCustomerCreation, customerController.createCustomer);

// Update customer
router.put('/:id', validateCustomerUpdate, customerController.updateCustomer);

// Delete customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router; 