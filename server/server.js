require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const connectMongo = require('./config/mongo');
const pool = require('./config/mysql');

const app = express();

app.use(cors());
app.use(express.json());

connectMongo();

app.get('/', (req, res) => {
  res.json({ message: 'Blogapp API is alive 🚀' });
});

app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({
      mysql: rows[0].result === 2 ? 'ok' : 'fail',
      mongo: mongoose.connection.readyState === 1 ? 'ok' : 'fail',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.use('/api/auth', require('./routes/auth.routes'));
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));