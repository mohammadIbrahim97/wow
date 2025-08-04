const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'wow_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'wow_marketplace',
  password: process.env.DB_PASSWORD || 'wow_password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

module.exports = {
  pool,
  testConnection,
  dbConfig
};