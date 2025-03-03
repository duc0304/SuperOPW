const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./models');
const routes = require('./routes');

// Initialize express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync database
db.sequelize.sync()
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to API' });
});

// API routes
app.use('/api', routes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;
