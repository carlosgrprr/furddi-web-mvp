const request = require('supertest');
const createServer = require('../server'); // Import a function to create the app instance
const mongoose = require('mongoose');
const User = require('../models/User');

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue('Mock email sent'),
  }),
}));

let server;

jest.setTimeout(20000); // Increase timeout to 20 seconds

beforeAll(async () => {
  process.env.TEST_MODE = 'true'; // Explicitly set test mode
  await mongoose.disconnect(); // Ensure no active connections
  await mongoose.connect('mongodb://localhost:27017/fruddi_test', {
    serverSelectionTimeoutMS: 10000, // Add timeout for MongoDB connection
  });
  const appInstance = createServer(); // Create a new app instance for testing
  server = appInstance.listen(4000); // Start the server on a different port for testing
});

beforeEach(async () => {
  console.log('Setting up test environment'); // Debug log
});

afterEach(async () => {
  console.log('Clearing database after test'); // Debug log
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    if (collection.collectionName !== 'users') { // Skip clearing the 'users' collection
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) { // Check if connection is established
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
  server.close(); // Close the server after tests
});

describe('User Authentication Routes', () => {
  it('should register a new user', async () => {
    const res = await request(server).post('/api/users/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    console.log('Full response object:', res); // Debug log
    expect(res.statusCode).toBe(201);
    expect(res.text).toContain('User registered successfully');

    // Introduce a delay after user creation
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should not register a user with an existing email', async () => {
    // Log database state before duplicate email check
    const usersBefore = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('Database state before duplicate email check:', usersBefore); // Debug log

    const res = await request(server).post('/api/users/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(400);
  });

  it('should login a registered user', async () => {
    // Create a user before testing login
    await request(server).post('/api/users/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });

    const res = await request(server).post('/api/users/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with incorrect credentials', async () => {
    const res = await request(server).post('/api/users/login').send({
      email: 'testuser@example.com',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });
});