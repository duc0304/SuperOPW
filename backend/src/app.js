const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const soapRoutes = require('./routes/soap.routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.text({ type: 'text/xml' }));

// Routes
app.use('/api', soapRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Không khởi động server ở đây để tránh xung đột với server.js
module.exports = app;
