const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('0_public')); // Fixed: serve from 0_public directory
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Import routes
const catalogRoutes = require('./1_src/0_modules/catalog/routes');

// Use routes
app.use('/api', catalogRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'WOW Store API is running!' });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '0_public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});