const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectDB = async () => {
  try {
    // Make sure to replace YOUR_MONGODB_URI with your actual MongoDB Atlas connection string.
    // For local development, you can set this directly or use a .env file locally.
    console.log(process.env.MONGODB_URI)
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

