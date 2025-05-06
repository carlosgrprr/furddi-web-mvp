const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const logger = require('../utils/logger'); // Import logger utility
const { authenticateToken } = require('../utils/authMiddleware'); // Import middleware

// Get all blog articles with optional category filtering
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const blogs = await Blog.find(filter);
    res.json(blogs);
  } catch (error) {
    logger.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Protect sensitive routes
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const blog = new Blog({ title, content, category });
    await blog.save();
    res.status(201).json({ message: 'Blog article created successfully' });
  } catch (error) {
    logger.error('Error creating blog:', error);
    res.status(400).json({ error: 'Failed to create blog' });
  }
});

module.exports = router;