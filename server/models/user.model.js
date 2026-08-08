const pool = require('../config/mysql');

const User = {
  async create({ name, email, passwordHash, role = 'user' }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async findByIds(ids) {
    if (!ids.length) return [];
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await pool.execute(
      `SELECT id, name FROM users WHERE id IN (${placeholders})`,
      ids
    );
    return rows;
  },

  async countAll() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
    return rows[0].total;
  },
};

module.exports = User;