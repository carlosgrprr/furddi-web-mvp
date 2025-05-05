const mongoose = require('mongoose');

let connection;

async function connectToDatabase() {
  if (!connection) {
    connection = mongoose.connection;

    if (connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/testdb'); // Removed deprecated options
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