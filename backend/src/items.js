const express = require('express');
const { authenticateToken } = require('./auth');
const router = express.Router();

// In-memory storage
let items = [];
let nextId = 1;

// GET /items
router.get('/items', authenticateToken, (req, res) => {
  res.status(200).json(items);
});

// POST /items
router.post('/items', authenticateToken, (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newItem = {
    id: nextId++,
    title: title.trim(),
    description: description || ''
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /items/:id
router.put('/items/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description } = req.body;

  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  if (title !== undefined) {
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    items[itemIndex].title = title.trim();
  }

  if (description !== undefined) {
    items[itemIndex].description = description;
  }

  res.status(200).json(items[itemIndex]);
});

// DELETE /items/:id
router.delete('/items/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  items.splice(itemIndex, 1);
  res.status(204).send();
});

// Helper function for testing to reset the store
const resetStore = () => {
  items = [];
  nextId = 1;
};

// Reset endpoint for testing
router.post('/reset', (req, res) => {
  resetStore();
  res.status(200).json({ message: 'Store reset successfully' });
});

module.exports = router;
module.exports.resetStore = resetStore;
