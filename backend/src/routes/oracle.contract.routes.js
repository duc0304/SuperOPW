const express = require('express');
const router = express.Router();
const contractController = require('../controllers/oracle.contract.controller');

// Route để lấy contracts theo client ID dưới dạng cây phân cấp đầy đủ
router.get('/client/:clientId', contractController.getContractsByClientId);

// Routes cho cấu trúc cây hợp đồng
router.get('/top-level', contractController.getTopLevelContracts);
router.get('/:parentId/issue-children', contractController.getIssueContracts);
router.get('/:parentId/card-children', contractController.getCardContracts);
router.get('/full-hierarchy', contractController.getFullContractHierarchy);

module.exports = router;