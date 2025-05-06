const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateToken } = require('../utils/authMiddleware'); // Import middleware
const logger = require('../utils/logger'); // Import logger utility

// Create a new product tracking entry
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, origin, journey, authenticity } = req.body;
    const product = new Product({ name, description, price, category, origin, journey, authenticity }); // Include all required fields
    await product.save();
    res.status(201).json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product tracking entry' });
  }
});

// Fetch product tracking details
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({
      productName: product.name,
      origin: product.origin,
      journey: product.journey,
      authenticity: product.authenticity,
    }); // Include productName in the response
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product tracking details' });
  }
});

// Protect sensitive routes
router.get('/track/:id', authenticateToken, async (req, res) => {
  try {
    // ...existing code...
  } catch (error) {
    logger.error('Error tracking product:', error);
    res.status(500).json({ error: 'Failed to track product' });
  }
});

// Update product tracking details
router.put('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { journey } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: { journey } },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product tracking details' });
  }
});

module.exports = router;