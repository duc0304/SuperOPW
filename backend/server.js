const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const db = require('./src/models');
const oracleConfig = require('./src/config/oracle.config');
const PORT = process.env.PORT || 5000;

// Khởi tạo Oracle connection pool và khởi động server
async function startServer() {
  try {
    // Khởi tạo Oracle connection pool
    await oracleConfig.initialize();
    console.log('Oracle connection initialized');
    
    // Sync database
    await db.sequelize.sync({ force: false });
    console.log('Database synchronized');
    
    // Khởi động server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Xử lý khi server shutdown
    process.on('SIGINT', async () => {
      try {
        await oracleConfig.closePool();
        console.log('Oracle connection pool closed');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
