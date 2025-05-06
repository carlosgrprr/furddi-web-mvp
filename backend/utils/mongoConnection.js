const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const MONGO_URI = process.env.MONGO_URI; // Use MONGO_URI from environment variables

let connection;

async function connectToDatabase() {
  if (!connection) {
    connection = mongoose.connection;

    if (connection.readyState === 0) {
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
    }
  }
  return connection;
}

async function closeDatabaseConnection() {
  if (connection && connection.readyState !== 0) {
    await mongoose.connection.close();
    connection = null;
    console.log('Disconnected from MongoDB');
  }
}

module.exports = { connectToDatabase, closeDatabaseConnection };