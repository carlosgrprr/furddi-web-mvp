const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all blog articles with optional category filtering
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const blogs = await Blog.find(filter);
    res.json(blogs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new blog article with category
router.post('/', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const blog = new Blog({ title, content, category });
    await blog.save();
    res.status(201).send('Blog article created successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;