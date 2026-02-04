// src/app.js
const express = require('express');
const cors = require('cors');
const config = require('./config/config');

// Import routes
const deviceRoutes = require('./routes/device');
const verificationRoutes = require('./routes/verification');
const profileRoutes = require('./routes/profile');
const matchRoutes = require('./routes/match');
const reportRoutes = require('./routes/report');

// Create Express app
const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' })); // For base64 images
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Anonymous Chat API',
    status: 'running',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// API Routes
app.use('/api/device', deviceRoutes);
app.use('/api/verify', verificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/report', reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;