const { getConnection, closeConnection } = require('../../config/oracle.config');
const { formatOracleResult, handleOracleError } = require('../../utils/oracle.helper');

// Lấy tất cả contracts
async function getAllContracts() {
  let connection;
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT * FROM ACNT_CONTRACT`,
      []
    );
    
    return formatOracleResult(result);
  } catch (err) {
    console.error('Error fetching contracts from Oracle:', err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

// Lấy contract theo ID
async function getContractById(id) {
  let connection;
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT * FROM ACNT_CONTRACT WHERE ID = :id`,
      { id }
    );
    
    const contracts = formatOracleResult(result);
    return contracts.length > 0 ? contracts[0] : null;
  } catch (err) {
    console.error('Error fetching contract from Oracle:', err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

module.exports = {
  getAllContracts,
  getContractById
}; 