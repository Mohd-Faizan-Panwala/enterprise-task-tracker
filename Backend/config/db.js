const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://taskadmin:Faizan5532@cluster0.m5jkpvu.mongodb.net/taskqueue?retryWrites=true&w=majority';
    await mongoose.connect(MONGO_URI);
    console.log('🍃 Connected to MongoDB Cluster (Enterprise Engine)');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;