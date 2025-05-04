const request = require('supertest');
const createServer = require('../server');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const app = createServer();

describe('Marketplace Routes', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/fruddi_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should fetch all products', async () => {
    const response = await request(app).get('/api/marketplace');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new product', async () => {
    const newProduct = { name: 'Test Product', description: 'Test Description', price: 100, category: 'Test', stock: 10 };
    const response = await request(app).post('/api/marketplace').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.text).toBe('Product added successfully');
  });
});