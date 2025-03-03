const db = require('../models');
const Customer = db.Customer;
const { Op } = db.Sequelize;
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');

// Get all customers with pagination, search and filter
exports.getAllCustomers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = 'all',
      sortBy = 'id',
      sortOrder = 'DESC',
      branch = ''
    } = req.query;
    
    // Build filter conditions
    const whereConditions = {};
    
    // Filter by status if not 'all'
    if (status !== 'all') {
      whereConditions.status = status;
    }
    
    // Filter by branch if provided
    if (branch) {
      whereConditions.branch = branch;
    }
    
    // Add search condition if search term is provided
    if (search) {
      whereConditions[Op.or] = [
        { companyName: { [Op.iLike]: `%${search}%` } },
        { shortName: { [Op.iLike]: `%${search}%` } },
        { clientNumber: { [Op.iLike]: `%${search}%` } },
        { clientTypeCode: { [Op.iLike]: `%${search}%` } },
        { branch: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Determine sort field and order
    let order = [[sortBy, sortOrder]];
    if (sortBy === 'Most Contracts') {
      order = [['contractsCount', 'DESC']];
    } else if (sortBy === 'Latest Customers') {
      order = [['id', 'DESC']];
    } else if (sortBy === 'Oldest Customers') {
      order = [['id', 'ASC']];
    }
    
    // Query customers with pagination
    const { count, rows } = await Customer.findAndCountAll({
      where: whereConditions,
      order,
      limit: parseInt(limit),
      offset
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / parseInt(limit));
    
    return res.status(200).json(
      new ApiResponse(200, {
        customers: rows,
        pagination: {
          total: count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }, 'Customers retrieved successfully')
    );
  } catch (error) {
    console.error('Error retrieving customers:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve customers', [error.message])
    );
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const customer = await Customer.findByPk(id);
    
    if (!customer) {
      return res.status(404).json(
        new ApiError(404, 'Customer not found')
      );
    }
    
    return res.status(200).json(
      new ApiResponse(200, { customer }, 'Customer retrieved successfully')
    );
  } catch (error) {
    console.error('Error retrieving customer:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve customer', [error.message])
    );
  }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const {
      companyName,
      shortName,
      clientNumber,
      clientTypeCode,
      reasonCode,
      reason,
      institutionCode,
      branch,
      clientCategory,
      productCategory,
      status = 'active',
      contractsCount = 0
    } = req.body;
    
    // Validate required fields
    if (!companyName || !shortName || !clientNumber || !clientTypeCode) {
      return res.status(400).json(
        new ApiError(400, 'Required fields are missing')
      );
    }
    
    // Check if client number already exists
    const existingCustomer = await Customer.findOne({ where: { clientNumber } });
    if (existingCustomer) {
      return res.status(400).json(
        new ApiError(400, 'Client number already exists')
      );
    }
    
    // Create new customer
    const newCustomer = await Customer.create({
      companyName,
      shortName,
      clientNumber,
      clientTypeCode,
      reasonCode,
      reason,
      institutionCode,
      branch,
      clientCategory,
      productCategory,
      status,
      contractsCount
    });
    
    return res.status(201).json(
      new ApiResponse(201, { customer: newCustomer }, 'Customer created successfully')
    );
  } catch (error) {
    console.error('Error creating customer:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to create customer', [error.message])
    );
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      companyName,
      shortName,
      clientNumber,
      clientTypeCode,
      reasonCode,
      reason,
      institutionCode,
      branch,
      clientCategory,
      productCategory,
      status,
      contractsCount
    } = req.body;
    
    // Find customer
    const customer = await Customer.findByPk(id);
    
    if (!customer) {
      return res.status(404).json(
        new ApiError(404, 'Customer not found')
      );
    }
    
    // Check if client number already exists (if changed)
    if (clientNumber && clientNumber !== customer.clientNumber) {
      const existingCustomer = await Customer.findOne({ where: { clientNumber } });
      if (existingCustomer) {
        return res.status(400).json(
          new ApiError(400, 'Client number already exists')
        );
      }
    }
    
    // Update customer
    await customer.update({
      companyName: companyName || customer.companyName,
      shortName: shortName || customer.shortName,
      clientNumber: clientNumber || customer.clientNumber,
      clientTypeCode: clientTypeCode || customer.clientTypeCode,
      reasonCode: reasonCode !== undefined ? reasonCode : customer.reasonCode,
      reason: reason !== undefined ? reason : customer.reason,
      institutionCode: institutionCode !== undefined ? institutionCode : customer.institutionCode,
      branch: branch !== undefined ? branch : customer.branch,
      clientCategory: clientCategory !== undefined ? clientCategory : customer.clientCategory,
      productCategory: productCategory !== undefined ? productCategory : customer.productCategory,
      status: status || customer.status,
      contractsCount: contractsCount !== undefined ? contractsCount : customer.contractsCount
    });
    
    return res.status(200).json(
      new ApiResponse(200, { customer }, 'Customer updated successfully')
    );
  } catch (error) {
    console.error('Error updating customer:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to update customer', [error.message])
    );
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find customer
    const customer = await Customer.findByPk(id);
    
    if (!customer) {
      return res.status(404).json(
        new ApiError(404, 'Customer not found')
      );
    }
    
    // Delete customer
    await customer.destroy();
    
    return res.status(200).json(
      new ApiResponse(200, {}, 'Customer deleted successfully')
    );
  } catch (error) {
    console.error('Error deleting customer:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to delete customer', [error.message])
    );
  }
};

// Get customer statistics
exports.getCustomerStats = async (req, res) => {
  try {
    // Count total customers
    const totalCustomers = await Customer.count();
    
    // Count active customers
    const activeCustomers = await Customer.count({ where: { status: 'active' } });
    
    // Count inactive customers
    const inactiveCustomers = await Customer.count({ where: { status: 'inactive' } });
    
    // Get unique branches
    const branches = await Customer.findAll({
      attributes: ['branch'],
      group: ['branch'],
      raw: true
    });
    
    return res.status(200).json(
      new ApiResponse(200, {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        branches: branches.map(b => b.branch).filter(Boolean)
      }, 'Customer statistics retrieved successfully')
    );
  } catch (error) {
    console.error('Error retrieving customer statistics:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to retrieve customer statistics', [error.message])
    );
  }
}; 