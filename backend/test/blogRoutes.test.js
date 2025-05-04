const request = require('supertest');
const createServer = require('../server');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const app = createServer();

describe('Blog Routes', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/fruddi_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
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
    expect(response.text).toBe('Blog article created successfully');
  });
});