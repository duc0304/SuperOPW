const express = require('express');
const router = express.Router();
const oracleClientController = require('../controllers/oracle.client.controller');

// Route để lấy tất cả clients
router.get('/', oracleClientController.getAllClients);

// Route để lấy client theo ID
router.get('/:id', oracleClientController.getClientById);

module.exports = router; 