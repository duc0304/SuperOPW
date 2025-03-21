const express = require('express');
const router = express.Router();
const oracleContractController = require('../controllers/oracle.contract.controller');

// Route để lấy tất cả contracts
router.get('/', oracleContractController.getAllContracts);

// Route để lấy contracts theo client ID
router.get('/client/:clientId', oracleContractController.getContractsByClientId);

module.exports = router; 