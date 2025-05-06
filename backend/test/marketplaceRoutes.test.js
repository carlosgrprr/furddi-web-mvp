const request = require('supertest');
const createServer = require('../server');
const { connectToDatabase, closeDatabaseConnection } = require('../utils/mongoConnection');
const Product = require('../models/Product');

const app = createServer();

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await closeDatabaseConnection();
});

describe('Marketplace Routes', () => {
  it('should fetch all products', async () => {
    const response = await request(app).get('/api/marketplace');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new product', async () => {
    const newProduct = { 
      name: 'Test Product', 
      description: 'Test Description', 
      price: 100, 
      category: 'Test', 
      stock: 10, 
      origin: 'Test Origin' // Added required field
    };
    const token = 'mocked-jwt-token'; // Mock token
    const response = await request(app).post('/api/marketplace/add-product').set('Authorization', `Bearer ${token}`).send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Product added successfully'); // Adjusted to match JSON response format
  });
});