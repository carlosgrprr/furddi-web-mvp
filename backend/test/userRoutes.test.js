const request = require('supertest');
const createServer = require('../server'); // Import a function to create the app instance
const mongoose = require('mongoose');
const User = require('../models/User');
const { closeDatabaseConnection } = require('../utils/mongoConnection'); // Import closeDatabaseConnection

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue('Mock email sent'),
  }),
}));

let server;
let connection; // Ensure mongoose connection is reused

jest.setTimeout(20000); // Increase timeout to 20 seconds

beforeAll(async () => {
  if (!connection) {
    connection = await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  process.env.TEST_MODE = 'true'; // Explicitly set test mode
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
  if (connection) {
    await mongoose.connection.close(); // Close MongoDB connection
  }
  server.close(); // Close the server

  // Clear any active timers
  jest.clearAllTimers();

  await closeDatabaseConnection(); // Ensure proper cleanup of MongoDB connection
});

describe('User Authentication Routes', () => {
  it('should register a new user', async () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`; // Generate a unique email
    const res = await request(server).post('/api/users/register').send({
      name: 'Test User',
      email: uniqueEmail,
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