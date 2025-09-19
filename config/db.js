const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://vishnup:vishnu8086@cluster0.norh57t.mongodb.net/',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'mern-auth', // Optional: Replace with your DB name
      }
    );
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit on failure
  }
};

module.exports = connectDB;