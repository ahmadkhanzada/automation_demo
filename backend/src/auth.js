const express = require('express');
const router = express.Router();

const VALID_EMAIL = 'user@example.com';
const VALID_PASSWORD = 'Password123';
const TEST_TOKEN = 'test-token-123';

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    res.status(200).json({ token: TEST_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token !== TEST_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

module.exports = router;
module.exports.authenticateToken = authenticateToken;
