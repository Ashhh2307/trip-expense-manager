const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelwise';

  try {
    // Attempt connecting to the primary MongoDB URI with a short timeout
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected to: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (primaryError) {
    console.warn(`⚠️ Could not connect to primary MongoDB at ${primaryUri} (${primaryError.message}).`);
    console.log('🔄 Initializing embedded in-memory MongoDB server for zero-config startup...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ In-Memory MongoDB Connected successfully at: ${memoryUri}`);
    } catch (memError) {
      console.error('❌ Failed to connect to in-memory MongoDB:', memError.message);
      process.exit(1);
    }
  }

  // Check if we need to seed demo data
  try {
    const { autoSeedDemoData } = require('../utils/seedData');
    await autoSeedDemoData();
  } catch (seedErr) {
    console.warn('⚠️ Auto-seeding notice:', seedErr.message);
  }
};

module.exports = connectDB;
