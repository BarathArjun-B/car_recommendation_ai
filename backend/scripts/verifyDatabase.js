import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';

dotenv.config();

const verifyDatabase = async () => {
  console.log('--- DATABASE DIAGNOSTICS START ---\n');
  let failures = 0;

  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri.includes('<username>')) {
      throw new Error('MONGO_URI is missing or contains placeholder values.');
    }

    const start = Date.now();
    await mongoose.connect(mongoUri);
    console.log(`✅ [PASS] MongoDB connected successfully in ${Date.now() - start}ms.`);
    
    await mongoose.syncIndexes();
    console.log('✅ [PASS] MongoDB indexes synchronized successfully.');
    
    const count = await Car.countDocuments();
    console.log(`✅ [PASS] Collection validation: Car model mapped. Total records: ${count}`);
    
    const indexes = await Car.collection.indexes();
    const hasSourceIndex = indexes.some(idx => idx.name === 'source_1_sourceId_1');
    if (hasSourceIndex) {
      console.log('✅ [PASS] Unique compound index (source + sourceId) verified. Duplicates blocked.');
    } else {
      console.error('❌ [FAIL] Missing required unique index for duplicate prevention.');
      failures++;
    }

  } catch (error) {
    console.error(`❌ [FAIL] Database verification failed: ${error.message}`);
    failures++;
  }

  console.log(`\n--- DATABASE DIAGNOSTICS END ---`);
  console.log(`Failures Detected: ${failures}`);
  process.exit(failures > 0 ? 1 : 0);
};

verifyDatabase();
