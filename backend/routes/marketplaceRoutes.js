const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
<<<<<<< HEAD
=======
const logger = require('../utils/logger'); // Import logger utility
>>>>>>> 48b70d8 (Commit inicial de prueba)

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
<<<<<<< HEAD
    res.status(500).send(error.message);
=======
    logger.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
>>>>>>> 48b70d8 (Commit inicial de prueba)
  }
});

// Add a new product with price, category, and stock
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = new Product({ name, description, price, category, stock });
    await product.save();
<<<<<<< HEAD
    res.status(201).send('Product added successfully');
  } catch (error) {
    res.status(400).send(error.message);
=======
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    logger.error('Error adding product:', error);
    res.status(400).json({ error: 'Failed to add product' });
>>>>>>> 48b70d8 (Commit inicial de prueba)
  }
});

// Add a review to a product
router.post('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
<<<<<<< HEAD
      return res.status(404).send('Product not found');
=======
      return res.status(404).json({ error: 'Product not found' });
>>>>>>> 48b70d8 (Commit inicial de prueba)
    }

    const review = { user: userId, rating, comment };
    product.reviews.push(review);
    await product.save();

<<<<<<< HEAD
    res.status(201).send('Review added successfully');
  } catch (error) {
    res.status(500).send(error.message);
=======
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    logger.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
>>>>>>> 48b70d8 (Commit inicial de prueba)
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
<<<<<<< HEAD
    res.status(500).send(error.message);
=======
    logger.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
>>>>>>> 48b70d8 (Commit inicial de prueba)
  }
});

module.exports = router;