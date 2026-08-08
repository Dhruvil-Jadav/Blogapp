const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
});

pool.getConnection()
  .then((conn) => { console.log('✅ MySQL connected'); conn.release(); })
  .catch((err) => console.error('❌ MySQL error:', err.message));

module.exports = pool;