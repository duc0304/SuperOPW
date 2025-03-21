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

// Lấy contracts theo client ID
async function getContractsByClientId(clientId) {
  let connection;
  try {
    connection = await getConnection();
    
    console.log(`Executing query to find all contracts for CLIENT__ID = ${clientId}`);
    
    // Debug: check total contracts in table
    const countResult = await connection.execute(
      `SELECT COUNT(*) AS total FROM ACNT_CONTRACT`,
      {}
    );
    const totalCount = formatOracleResult(countResult)[0].TOTAL;
    console.log(`Total contracts in ACNT_CONTRACT table: ${totalCount}`);
    
    // Debug: check if this specific client has any contracts
    const clientContractCount = await connection.execute(
      `SELECT COUNT(*) AS client_total FROM ACNT_CONTRACT WHERE CLIENT__ID = :clientId`,
      { clientId }
    );
    const clientTotal = formatOracleResult(clientContractCount)[0].CLIENT_TOTAL;
    console.log(`Total contracts for client ${clientId}: ${clientTotal}`);
    
    // Debug: check active contracts for this client
    const activeClientContractCount = await connection.execute(
      `SELECT COUNT(*) AS active_client_total FROM ACNT_CONTRACT 
       WHERE CLIENT__ID = :clientId 
       AND AMND_STATE = 'A'`,
      { clientId }
    );
    const activeClientTotal = formatOracleResult(activeClientContractCount)[0].ACTIVE_CLIENT_TOTAL;
    console.log(`Active contracts for client ${clientId}: ${activeClientTotal}`);
    
    // Lấy tất cả contracts có CLIENT__ID = clientId và AMND_STATE = 'A' (active)
    const result = await connection.execute(
      `SELECT * FROM ACNT_CONTRACT 
       WHERE CLIENT__ID = :clientId
       AND AMND_STATE = 'A'`,
      { clientId }
    );
    
    const contracts = formatOracleResult(result);
    console.log(`Found ${contracts.length} active contracts for client ID ${clientId}`);
    
    // Nếu không tìm thấy contracts, thử với TO_CHAR
    if (contracts.length === 0) {
      console.log('Trying with TO_CHAR conversion...');
      const charResult = await connection.execute(
        `SELECT * FROM ACNT_CONTRACT 
         WHERE TO_CHAR(CLIENT__ID) = TO_CHAR(:clientId)
         AND AMND_STATE = 'A'`,
        { clientId }
      );
      
      const charContracts = formatOracleResult(charResult);
      console.log(`Found ${charContracts.length} active contracts with TO_CHAR conversion`);
      
      return charContracts;
    }
    
    return contracts;
  } catch (err) {
    console.error('Error fetching contracts by client ID from Oracle:', err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

module.exports = {
  getAllContracts,
  getContractsByClientId
}; 