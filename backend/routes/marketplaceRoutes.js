const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const logger = require('../utils/logger'); // Import logger utility

// Get all products with category and name filtering
router.get('/', async (req, res) => {
  try {
    const { category, name } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (name) filter.name = { $regex: name, $options: 'i' };

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    logger.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product with price, category, stock, and origin
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, stock, origin } = req.body; // Added 'origin' field
    const product = new Product({ name, description, price, category, stock, origin }); // Include 'origin' in product creation
    await product.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    logger.error('Error adding product:', error);
    res.status(400).json({ error: 'Failed to add product' });
  }
});

// Add a review to a product
router.post('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const review = { user: userId, rating, comment };
    product.reviews.push(review);
    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    logger.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Get reviews for a product
router.get('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate('reviews.user', 'name email');
    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.json(product.reviews);
  } catch (error) {
    logger.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;