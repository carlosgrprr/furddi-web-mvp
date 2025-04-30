const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fruddi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});