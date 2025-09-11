const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3001',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const noteRoutes = require('./routes/notes');
const importExportRoutes = require('./routes/importExport');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api', importExportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static files from the React app build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test endpoint for Google Auth debugging
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ 
    message: 'Backend is reachable',
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured',
    cors: 'Enabled',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/test-post', (req, res) => {
  console.log('Test POST endpoint hit');
  console.log('Request body:', req.body);
  res.json({ 
    message: 'POST request received',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Handle React routing, return all requests to React app in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});