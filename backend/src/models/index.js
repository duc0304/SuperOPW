const { Sequelize } = require('sequelize');

// Cấu hình kết nối database
const sequelize = new Sequelize(
  process.env.DB_NAME || 'customer_support_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
    define: {
      // Cấu hình mặc định cho tất cả model
      underscored: true, // Sử dụng snake_case cho tên cột
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model')(sequelize, Sequelize);
// Add Customer model
db.Customer = require('./customer.model')(sequelize, Sequelize);

// Định nghĩa các mối quan hệ giữa các model (nếu có)
// Ví dụ: db.User.hasMany(db.Customer);
// db.Customer.belongsTo(db.User);

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Thay đổi cách sync database
db.sequelize.sync({ 
  alter: false, // Không thay đổi cấu trúc bảng
  force: false, // Không xóa và tạo lại bảng
  hooks: false // Tắt hooks
})
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

module.exports = db; 