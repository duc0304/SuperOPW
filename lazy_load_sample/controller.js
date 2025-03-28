// Trong client.controller.js
exports.getAllClients = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Trang hiện tại
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; // Số item mỗi trang
      const offset = (page - 1) * itemsPerPage;
  
      const clients = await clientModel.getAllClientsPaginated(offset, itemsPerPage);
      const totalClients = await clientModel.getTotalClientsCount(); // Hàm mới để đếm tổng số client
  
      const formattedClients = clients.map((client) => ({
        ID: client.ID,
        companyName: client.COMPANY_NAM || 'Unknown',
        shortName: client.SHORT_NAME || (client.CLIENT_NAME?.substring(0, 10) + '...') || 'Unknown',
        clientNumber: client.CLIENT_NUMBER || `CL-${client.ID}`,
        cityzenship: client.CITIZENSHIP || 'N/A',
        dateOpen: client.DATE_OPEN || null,
        status: client.STATUS?.toLowerCase() === 'inactive' ? 'inactive' : 'active'
      }));
  
      return res.status(200).json(
        new ApiResponse(200, {
          clients: formattedClients,
          totalItems: totalClients,
          currentPage: page,
          totalPages: Math.ceil(totalClients / itemsPerPage)
        }, 'Clients retrieved successfully')
      );
    } catch (error) {
      console.error('Controller error - getAllClients:', error);
      return res.status(500).json(
        new ApiError(500, 'Failed to retrieve clients', [error.message])
      );
    }
  };