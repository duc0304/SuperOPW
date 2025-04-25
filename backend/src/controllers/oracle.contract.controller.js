const contractModel = require('../models/oracle/contract.model');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');

// Lấy tất cả contracts theo client ID dưới dạng cây phân cấp đầy đủ
exports.getContractsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const search = req.query.search || '';

    if (!clientId) {
      return res.status(400).json(
        new ApiError(400, 'Client ID is required', ['Missing client ID in request'])
      );
    }

    console.log(`Processing request for contract hierarchy with client ID: ${clientId}, search: ${search}`);

    const result = await contractModel.getFullContractHierarchyByClientId(clientId, page, itemsPerPage, search);

    return res.status(200).json(
      new ApiResponse(
        200,
        { contracts: result.data, pagination: result.pagination },
        `Contract hierarchy for client ${clientId} retrieved successfully`
      )
    );
  } catch (error) {
    console.error('Controller error - getContractsByClientId:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve contract hierarchy for client', [error.message])
    );
  }
};

// Lấy các contracts cấp cao nhất (Liability) có phân trang
exports.getTopLevelContracts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    if (page < 1 || itemsPerPage < 1) {
      return res.status(400).json(
        new ApiError(400, 'Invalid pagination parameters', ['Page and itemsPerPage must be positive integers'])
      );
    }

    console.log(`Fetching top-level contracts (page: ${page}, itemsPerPage: ${itemsPerPage})`);

    const result = await contractModel.getTopLevelContracts(page, itemsPerPage);

    return res.status(200).json(
      new ApiResponse(
        200,
        { contracts: result.data, pagination: result.pagination },
        'Top-level contracts retrieved successfully'
      )
    );
  } catch (error) {
    console.error('Controller error - getTopLevelContracts:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve top-level contracts', [error.message])
    );
  }
};

// Lấy các Issue Contracts của một Liability Contract
exports.getIssueContracts = async (req, res) => {
  try {
    const { parentId } = req.params;

    if (!parentId) {
      return res.status(400).json(
        new ApiError(400, 'Parent contract ID is required', ['Missing parent contract ID in request'])
      );
    }

    console.log(`Fetching issue contracts for parent ID: ${parentId}`);

    const issueContracts = await contractModel.getIssueContracts(parentId);

    return res.status(200).json(
      new ApiResponse(
        200,
        issueContracts,
        `Issue contracts for parent ID ${parentId} retrieved successfully`
      )
    );
  } catch (error) {
    console.error('Controller error - getIssueContracts:', error);
    if (error.message.includes('Parent contract with ID')) {
      return res.status(404).json(
        new ApiError(404, error.message, ['Parent contract not found'])
      );
    }
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve issue contracts', [error.message])
    );
  }
};

// Lấy các Card Contracts của một Issue Contract
exports.getCardContracts = async (req, res) => {
  try {
    const { parentId } = req.params;

    if (!parentId) {
      return res.status(400).json(
        new ApiError(400, 'Parent contract ID is required', ['Missing parent contract ID in request'])
      );
    }

    console.log(`Fetching card contracts for parent ID: ${parentId}`);

    const cardContracts = await contractModel.getCardContracts(parentId);

    return res.status(200).json(
      new ApiResponse(
        200,
        cardContracts,
        `Card contracts for parent ID ${parentId} retrieved successfully`
      )
    );
  } catch (error) {
    console.error('Controller error - getCardContracts:', error);
    if (error.message.includes('Parent contract with ID')) {
      return res.status(404).json(
        new ApiError(404, error.message, ['Parent contract not found'])
      );
    }
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve card contracts', [error.message])
    );
  }
};

// Lấy cấu trúc cây hợp đồng đầy đủ (bao gồm Issue và Card Contracts)
exports.getFullContractHierarchy = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    if (page < 1 || itemsPerPage < 1) {
      return res.status(400).json(
        new ApiError(400, 'Invalid pagination parameters', ['Page and itemsPerPage must be positive integers'])
      );
    }

    console.log(`Fetching full contract hierarchy (page: ${page}, itemsPerPage: ${itemsPerPage})`);

    const result = await contractModel.getFullContractHierarchy(page, itemsPerPage);

    return res.status(200).json(
      new ApiResponse(
        200,
        { contracts: result.data, pagination: result.pagination },
        'Full contract hierarchy retrieved successfully'
      )
    );
  } catch (error) {
    console.error('Controller error - getFullContractHierarchy:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve full contract hierarchy', [error.message])
    );
  }
};

