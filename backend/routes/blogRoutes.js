const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
<<<<<<< HEAD
=======
const logger = require('../utils/logger'); // Import logger utility
>>>>>>> 48b70d8 (Commit inicial de prueba)

// Get all blog articles with optional category filtering
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const blogs = await Blog.find(filter);
    res.json(blogs);
  } catch (error) {
<<<<<<< HEAD
    res.status(500).send(error.message);
=======
    logger.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
>>>>>>> 48b70d8 (Commit inicial de prueba)
  }
});

// Create a new blog article with category
router.post('/', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const blog = new Blog({ title, content, category });
    await blog.save();
<<<<<<< HEAD
    res.status(201).send('Blog article created successfully');
  } catch (error) {
    res.status(400).send(error.message);
=======
    res.status(201).json({ message: 'Blog article created successfully' });
  } catch (error) {
    logger.error('Error creating blog:', error);
    res.status(400).json({ error: 'Failed to create blog' });
>>>>>>> 48b70d8 (Commit inicial de prueba)
  }
});

module.exports = router;