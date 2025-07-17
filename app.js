require('dotenv').config();
const express   = require('express');
const pool      = require('../config/db');
const loanRoutes= require('../routes/loanRoutes');
const loanController  = require('../controllers/loanController');

const app = express();
app.use(express.json());

// Test DB connection
pool.connect()
  .then(client => {
    client.release();
    console.log('Connected to PostgreSQL');
  })
  .catch(err => {
    console.error('PostgreSQL connection failed', err.stack);
    process.exit(1);
  });

// Mount routes
app.use('/api/loans', loanRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
