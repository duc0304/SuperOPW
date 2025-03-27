const contractModel = require('../models/oracle/contract.model');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');

// Lấy tất cả contracts
exports.getAllContracts = async (req, res) => {
  try {
    const contracts = await contractModel.getAllContracts();
    

    if (contracts.length > 0) {
      console.log('First contract raw data:', JSON.stringify(contracts[0], null, 2));
    }
    
    const formattedContracts = contracts.map(contract => {
      return {
        ...contract,
        AMND_DATE: contract.AMND_DATE ? new Date(contract.AMND_DATE).toISOString() : null
      };
    });
    
    // Log số lượng contracts tìm thấy
    console.log(`Found ${formattedContracts.length} contracts`);
    
    return res.status(200).json(
      new ApiResponse(200, formattedContracts, 'Contracts retrieved successfully')
    );
  } catch (error) {
    console.error('Controller error - getAllContracts:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve contracts', [error.message])
    );
  }
};

// Lấy tất cả contracts theo client ID
exports.getContractsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    if (!clientId) {
      return res.status(400).json(
        new ApiError(400, 'Client ID is required', ['Missing client ID in request'])
      );
    }
    
    console.log(`Processing request for all contracts with client ID: ${clientId}`);
    
    const contracts = await contractModel.getContractsByClientId(clientId);
    
    // Log số lượng contracts tìm thấy
    console.log(`Found ${contracts.length} contracts for client ID: ${clientId}`);
    
    const formattedContracts = contracts.map(contract => {
      return {
        ...contract,
        AMND_DATE: contract.AMND_DATE ? new Date(contract.AMND_DATE).toISOString() : null
      };
    });
    
    return res.status(200).json(
      new ApiResponse(200, formattedContracts, `All contracts for client ${clientId} retrieved successfully`)
    );
  } catch (error) {
    console.error('Controller error - getContractsByClientId:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve contracts for client', [error.message])
    );
  }
}; 