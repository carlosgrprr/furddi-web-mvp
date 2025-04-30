const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products with category filtering
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
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

module.exports = router;