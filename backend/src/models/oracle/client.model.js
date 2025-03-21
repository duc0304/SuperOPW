const { getConnection, closeConnection } = require('../../config/oracle.config');
const { formatOracleResult, handleOracleError } = require('../../utils/oracle.helper');

// Lấy tất cả clients
async function getAllClients() {
  let connection;
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT * FROM CLIENT WHERE AMND_STATE='A'`,
      []
    );
    
    return formatOracleResult(result);
  } catch (err) {
    console.error('Error fetching clients from Oracle:', err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

// Lấy client theo ID từ Oracle
async function getClientById(id) {
  let connection;
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT * FROM CLIENT WHERE ID = :id AND AMND_STATE = 'A'`,
      { id }
    );
    
    const clients = formatOracleResult(result);
    return clients.length > 0 ? clients[0] : null;
  } catch (err) {
    console.error('Error fetching client by ID from Oracle:', err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

module.exports = {
  getAllClients,
  getClientById
}; 