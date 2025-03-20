const express = require('express');
const router = express.Router();
const oracleContractController = require('../controllers/oracle.contract.controller');

// Route để lấy tất cả contracts
router.get('/', oracleContractController.getAllContracts);

// Route để lấy contract theo ID
router.get('/:id', oracleContractController.getContractById);

module.exports = router; 