const { Pool } = require('pg');

const pool = new Pool({
  host: 'stone-db.ct4u0ieie860.ap-south-1.rds.amazonaws.com',
  user: 'postgres',
  password: 'Narender123',
  database: 'stone_db', 
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;