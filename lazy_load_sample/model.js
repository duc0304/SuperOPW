// Trong client.model.js
async function getAllClientsPaginated(offset, limit) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT * FROM CLIENT WHERE AMND_STATE='A' OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
        { offset, limit }
      );
      return formatOracleResult(result);
    } catch (err) {
      throw handleOracleError(err);
    } finally {
      await closeConnection(connection);
    }
  }
  
  async function getTotalClientsCount() {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT COUNT(*) as total FROM CLIENT WHERE AMND_STATE='A'`
      );
      const data = formatOracleResult(result);
      return data[0].TOTAL;
    } catch (err) {
      throw handleOracleError(err);
    } finally {
      await closeConnection(connection);
    }
  }
  
  module.exports = {
    getAllClientsPaginated,
    getTotalClientsCount,
    getClientById
  };