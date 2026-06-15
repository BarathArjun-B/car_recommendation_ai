import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes('<username>')) {
    console.warn('MongoDB Atlas URI is not configured. Set MONGO_URI in backend/.env before using database APIs.');
    return null;
  }

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    
    // Phase 4: Database Validation - Ensure indexes are built to prevent duplicates
    await mongoose.syncIndexes();
    console.log('[INFO] MongoDB indexes synchronized successfully.');
    
    return connection;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
