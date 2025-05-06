const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const productTrackerRoutes = require('./routes/productTrackerRoutes'); // Import product tracker routes
require('dotenv').config(); // Load environment variables

console.log('Environment variables loaded:', process.env);

if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in the environment variables.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in the environment variables.');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const isTestMode = process.env.NODE_ENV === 'test'; // Check if the application is running in test mode
console.log('Test mode:', isTestMode); // Debug log to verify test mode
console.log('MONGO_URI:', process.env.MONGO_URI); // Debug log to verify MONGO_URI

function createServer() {
  const app = express();

  // MongoDB connection
  const MONGO_URI = process.env.MONGO_URI;

  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err);
  });

  // Replace hardcoded JWT secret (if used elsewhere in the code)
  const jwtSecret = process.env.JWT_SECRET;

  // Swagger configuration
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'FRUDDI API',
        version: '1.0.0',
        description: 'API documentation for FRUDDI backend',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local server',
        },
      ],
    },
    apis: ['./routes/*.js'],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // Middleware
  app.use(express.json());
  app.use('/api/users', userRoutes);
  app.use('/api/blog', blogRoutes);
  app.use('/api/marketplace', marketplaceRoutes);
  app.use('/api/product-tracker', productTrackerRoutes); // Register product tracker routes

  // Serve static files from the frontend directory
  app.use(express.static(path.join(__dirname, '../frontend')));

  // Routes
  app.get('/', (req, res) => {
    res.send('Welcome to the FRUDDI backend!');
  });

  return app;
}

if (require.main === module) {
  const app = createServer();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = createServer;