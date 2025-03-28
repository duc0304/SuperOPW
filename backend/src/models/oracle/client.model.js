const {
  getConnection,
  closeConnection,
} = require("../../config/oracle.config");
const {
  formatOracleResult,
  handleOracleError,
} = require("../../utils/oracle.helper");

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
    console.error("Error fetching clients from Oracle:", err);
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
    console.error("Error fetching client by ID from Oracle:", err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

// Lấy clients theo trang với phân trang và tìm kiếm
async function getAllClientsPaginated(offset, limit, search = "") {
  let connection;
  try {
    connection = await getConnection();
    console.log(
      `Fetching clients with offset: ${offset}, limit: ${limit}, search: ${search}`
    );

    // Tạo điều kiện tìm kiếm
    let query = `SELECT * FROM CLIENT WHERE AMND_STATE='A'`;
    const bindParams = { offset, limit };

    if (search) {
      // Tìm kiếm theo shortName, companyName, clientNumber (không phân biệt hoa thường)
      query += ` AND (LOWER(SHORT_NAME) LIKE :search 
                     OR LOWER(COMPANY_NAM) LIKE :search 
                     OR LOWER(CLIENT_NUMBER) LIKE :search)`;
      bindParams.search = `%${search.toLowerCase()}%`; // Thêm % để tìm kiếm gần đúng
    }

    query += ` ORDER BY ID DESC OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;

    const result = await connection.execute(query, bindParams);
    return formatOracleResult(result);
  } catch (err) {
    console.error("Error fetching paginated clients from Oracle:", err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

// Lấy tổng số clients để tính totalPages (có hỗ trợ tìm kiếm)
async function getTotalClientsCount(search = "") {
  let connection;
  try {
    connection = await getConnection();

    let query = `SELECT COUNT(*) AS total FROM CLIENT WHERE AMND_STATE='A'`;
    const bindParams = {};

    if (search) {
      query += ` AND (LOWER(SHORT_NAME) LIKE :search 
                     OR LOWER(COMPANY_NAM) LIKE :search 
                     OR LOWER(CLIENT_NUMBER) LIKE :search)`;
      bindParams.search = `%${search.toLowerCase()}%`;
    }

    const result = await connection.execute(query, bindParams);
    const data = formatOracleResult(result);
    return data[0].TOTAL; // Trả về số lượng tổng
  } catch (err) {
    console.error("Error counting clients from Oracle:", err);
    throw handleOracleError(err);
  } finally {
    await closeConnection(connection);
  }
}

module.exports = {
  getAllClients,
  getClientById,
  getAllClientsPaginated,
  getTotalClientsCount,
};
