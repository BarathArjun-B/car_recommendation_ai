import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';
import { execSync } from 'child_process';

dotenv.config();

const cleanup = async () => {
  const apiNinjasKey = process.env.API_NINJAS_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!apiNinjasKey || apiNinjasKey.includes('your_') || !unsplashKey || unsplashKey.includes('your_')) {
    console.error('❌ FATAL: API Keys are still missing or invalid in .env. Aborting cleanup to protect fallback data.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected.');

  const deleted = await Car.deleteMany({});
  console.log(`🗑️ Removed ${deleted.deletedCount} mathematically inaccurate records for data migration.`);

  console.log('🚀 Re-running actual enrichment pipeline...');
  execSync('node scripts/importDataset.js', { stdio: 'inherit' });
  
  console.log('✅ Database is now populated exclusively with REAL enriched data!');
  process.exit(0);
};

cleanup();
