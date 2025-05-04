const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
<<<<<<< HEAD
=======
require('dotenv').config(); // Load environment variables
>>>>>>> 48b70d8 (Commit inicial de prueba)

const PORT = 3000;
const isTestMode = process.env.NODE_ENV === 'test'; // Check if the application is running in test mode
console.log('Test mode:', isTestMode); // Debug log to verify test mode

function createServer() {
  const app = express();

  // MongoDB connection
<<<<<<< HEAD
  mongoose.connect('mongodb://localhost:27017/fruddi', {
=======
  mongoose.connect(process.env.MONGO_URI, {
>>>>>>> 48b70d8 (Commit inicial de prueba)
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

<<<<<<< HEAD
=======
  // Replace hardcoded JWT secret (if used elsewhere in the code)
  const jwtSecret = process.env.JWT_SECRET;

>>>>>>> 48b70d8 (Commit inicial de prueba)
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