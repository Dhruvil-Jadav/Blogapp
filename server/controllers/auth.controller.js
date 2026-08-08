const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { signAccessToken } = require('../utils/token');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email and password are required' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = await User.findByEmail(email);
    if (existing)
      return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await User.create({ name, email, passwordHash });

    res.status(201).json({ message: 'User registered successfully', userId: id });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'email and password are required' });

    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signAccessToken(user);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Server error' });
  }

};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user, tokenPayload: req.user });
};