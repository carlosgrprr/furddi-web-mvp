const request = require('supertest');
const mongoose = require('mongoose');
const createServer = require('../server');
const Product = require('../models/Product');
const { connectToDatabase, closeDatabaseConnection } = require('../utils/mongoConnection');

const app = createServer();

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await closeDatabaseConnection();
});

describe('Product Tracker Routes', () => {
  let productId;

  it('should create a new product tracking entry', async () => {
    const response = await request(app)
      .post('/api/product-tracker')
      .send({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        category: 'Test Category',
        stock: 10,
        origin: 'Farm A',
        journey: ['Farm A', 'Warehouse B', 'Store C'],
        authenticity: true,
      });

    expect(response.status).toBe(201);
    expect(response.body.product).toHaveProperty('_id');
    productId = response.body.product._id;
  });

  it('should fetch product tracking details', async () => {
    const response = await request(app).get(`/api/product-tracker/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      productName: 'Test Product',
      origin: 'Farm A',
      journey: ['Farm A', 'Warehouse B', 'Store C'],
      authenticity: true,
    });
  });

  it('should update product tracking details', async () => {
    const response = await request(app)
      .put(`/api/product-tracker/${productId}`)
      .send({
        journey: ['Farm A', 'Warehouse B', 'Store C', 'Customer D'],
      });

    expect(response.status).toBe(200);
    expect(response.body.product.journey).toContain('Customer D');
  });
});