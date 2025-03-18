const oracledb = require('oracledb');

// Cấu hình kết nối Oracle
const oracleConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE_NAME}`
};

// Khởi tạo pool connection
async function initialize() {
  try {
    // Đặt autoCommit mặc định là true
    oracledb.autoCommit = true;
    
    // Đặt outFormat mặc định là OBJECT
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    
    await oracledb.createPool({
      ...oracleConfig,
      poolAlias: 'default',
      poolIncrement: 1,
      poolMin: 1,
      poolMax: 5,
      poolTimeout: 60
    });
    console.log('Oracle connection pool initialized successfully');
  } catch (err) {
    console.error('Failed to initialize Oracle connection pool:', err);
    throw err;
  }
}

// Lấy connection từ pool
async function getConnection() {
  try {
    return await oracledb.getConnection('default');
  } catch (err) {
    console.error('Error getting Oracle connection:', err);
    throw err;
  }
}

// Đóng connection
async function closeConnection(connection) {
  if (connection) {
    try {
      await connection.close();
    } catch (err) {
      console.error('Error closing Oracle connection:', err);
    }
  }
}

// Đóng pool
async function closePool() {
  try {
    await oracledb.getPool('default').close(10);
    console.log('Oracle connection pool closed');
  } catch (err) {
    console.error('Error closing Oracle connection pool:', err);
  }
}

module.exports = {
  initialize,
  getConnection,
  closeConnection,
  closePool
}; 