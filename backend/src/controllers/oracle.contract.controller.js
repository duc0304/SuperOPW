const contractModel = require('../models/oracle/contract.model');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');

// Lấy tất cả contracts
exports.getAllContracts = async (req, res) => {
  try {
    const contracts = await contractModel.getAllContracts();
    
    // Log dữ liệu của contract đầu tiên để kiểm tra cấu trúc
    if (contracts.length > 0) {
      console.log('First contract raw data:', JSON.stringify(contracts[0], null, 2));
    }
    
    // Format datetime nếu cần
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

// Lấy contract theo ID
exports.getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json(
        new ApiError(400, 'Contract ID is required', ['Missing contract ID in request'])
      );
    }
    
    const contract = await contractModel.getContractById(id);
    
    if (!contract) {
      return res.status(404).json(
        new ApiError(404, 'Contract not found', [`Contract with ID ${id} not found`])
      );
    }
    
    // Log dữ liệu thô của contract để kiểm tra cấu trúc
    console.log('Contract raw data:', JSON.stringify(contract, null, 2));
    
    // Format datetime nếu cần
    const formattedContract = {
      ...contract,
      AMND_DATE: contract.AMND_DATE ? new Date(contract.AMND_DATE).toISOString() : null
    };
    
    return res.status(200).json(
      new ApiResponse(200, formattedContract, 'Contract retrieved successfully')
    );
  } catch (error) {
    console.error('Controller error - getContractById:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve contract', [error.message])
    );
  }
}; 