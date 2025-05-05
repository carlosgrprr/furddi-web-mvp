const request = require('supertest');
const createServer = require('../server');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const { connectToDatabase, closeDatabaseConnection } = require('../utils/mongoConnection');

const app = createServer();

describe('Blog Routes', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  it('should fetch all blogs', async () => {
    const response = await request(app).get('/api/blog');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new blog', async () => {
    const newBlog = { title: 'Test Blog', content: 'Test Content', category: 'Test' };
    const response = await request(app).post('/api/blog').send(newBlog);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Blog article created successfully');
  });
});