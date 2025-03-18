const clientModel = require('../models/oracle/client.model');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');

// Lấy tất cả clients với các trường cần thiết cho customer table
exports.getAllClients = async (req, res) => {
  try {
    const clients = await clientModel.getAllClients();
    
    // Chuyển đổi dữ liệu từ Oracle sang định dạng phù hợp với customer table
    const formattedClients = clients.map((client, index) => {
      // Tạo ID duy nhất cho mỗi client
      const id = (index + 1).toString();
      
      // Lấy các trường cần thiết từ client Oracle
      return {
        id,
        companyName: client.COMPANY_NAM || 'Unknown',
        shortName: client.SHORT_NAME || (client.CLIENT_NAME?.substring(0, 10) + '...') || 'Unknown',
        clientNumber: client.CLIENT_NUMBER || client.ID || `CL-${id.padStart(3, '0')}`,
        cityzenship: client.CITIZENSHIP || 'N/A',
        dateOpen: client.DATE_OPEN || null,
        status: client.STATUS?.toLowerCase() === 'inactive' ? 'inactive' : 'active'
      };
    });
    
    return res.status(200).json(
      new ApiResponse(200, formattedClients, 'Clients retrieved successfully')
    );
  } catch (error) {
    console.error('Controller error - getAllClients:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve clients', [error.message])
    );
  }
};

// Lấy client theo ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json(
        new ApiError(400, 'Client ID is required', ['Missing client ID in request'])
      );
    }
    
    // Lấy tất cả clients trước (vì chưa có hàm getClientById trong model)
    const clients = await clientModel.getAllClients();
    
    // Vì ID là index + 1, nên cần -1 để lấy đúng client
    const clientIndex = parseInt(id) - 1;
    const client = clients[clientIndex];
    
    if (!client) {
      return res.status(404).json(
        new ApiError(404, 'Client not found', [`Client with ID ${id} not found`])
      );
    }
    
    // Trả về client với đầy đủ thông tin từ Oracle
    const clientData = {
      id,
      companyName: client.COMPANY_NAM || 'Unknown',
      shortName: client.SHORT_NAME || (client.CLIENT_NAME?.substring(0, 10) + '...') || 'Unknown',
      clientNumber: client.CLIENT_NUMBER || client.ID || `CL-${id.padStart(3, '0')}`,
      cityzenship: client.CITIZENSHIP || 'N/A',
      dateOpen: client.DATE_OPEN || null,
      status: client.STATUS?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
      // Thêm các trường bổ sung cho trang chi tiết
      FIRST_NAM: client.FIRST_NAM || null,
      LAST_NAM: client.LAST_NAM || null,
      FATHER_S_NAM: client.FATHER_S_NAM || null,
      BIRTH_DATE: client.BIRTH_DATE || null,
      GENDER: client.GENDER || null,
      PROFESSION: client.PROFESSION || null,
      CITY: client.CITY || null,
      ADDRESS_LINE_1: client.ADDRESS_LINE_1 || null,
      ADDRESS_LINE_2: client.ADDRESS_LINE_2 || null,
      ADDRESS_LINE_3: client.ADDRESS_LINE_3 || null,
      PHONE_H: client.PHONE_H || null,
      E_MAIL: client.E_MAIL || null
    };
    
    return res.status(200).json(
      new ApiResponse(200, clientData, 'Client retrieved successfully')
    );
  } catch (error) {
    console.error('Controller error - getClientById:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve client', [error.message])
    );
  }
}; 