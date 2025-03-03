const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const db = require('./src/models');
const PORT = process.env.PORT || 5000;

// Sync database
db.sequelize.sync({ force: false }) // Set force: true to drop and recreate tables (use with caution)
  .then(() => {
    console.log('Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
