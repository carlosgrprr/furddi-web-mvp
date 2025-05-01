const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

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
    res.status(500).send(error.message);
  }
});

// Add a new product with price, category, and stock
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = new Product({ name, description, price, category, stock });
    await product.save();
    res.status(201).send('Product added successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Add a review to a product
router.post('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    const review = { user: userId, rating, comment };
    product.reviews.push(review);
    await product.save();

    res.status(201).send('Review added successfully');
  } catch (error) {
    res.status(500).send(error.message);
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
    res.status(500).send(error.message);
  }
});

module.exports = router;