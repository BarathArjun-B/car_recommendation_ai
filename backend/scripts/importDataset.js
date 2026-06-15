import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { processAndUpsertCar } from '../jobs/ingestionPipeline.js';

dotenv.config();

const BATCH_SIZE = 5; // Small batch to respect API limits (Unsplash 50/hr, API Ninjas 50k/mo)

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected.');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const runImport = async (isDryRun = false) => {
  await connectDB();
  const filePath = path.resolve('data/indian_cars_dataset.json');
  
  if (!fs.existsSync(filePath)) {
    console.error(`Dataset not found at ${filePath}. Please download the Kaggle dataset first.`);
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Found ${rawData.length} records. Starting import...`);

  if (isDryRun) {
    console.log('DRY RUN ENABLED. Parsing first 5 records only.');
    console.log(rawData.slice(0, 5));
    process.exit(0);
  }

  let stats = {
    total: rawData.length,
    success: 0,
    failed: 0,
    missingImages: 0,
    missingSpecs: 0,
    errors: []
  };

  for (let i = 0; i < rawData.length; i += BATCH_SIZE) {
    const batch = rawData.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
    
    // Process concurrently in small batches to respect rate limits
    const promises = batch.map(car => processAndUpsertCar(car));
    const results = await Promise.all(promises);
    
    for (const res of results) {
      if (res.success) {
        stats.success++;
        if (!res.hasImage) stats.missingImages++;
        if (!res.hasSpecs) stats.missingSpecs++;
      } else {
        stats.failed++;
        stats.errors.push(res.error);
      }
    }
    
    // Sleep 2 seconds between batches to avoid API rate limiting
    if (i + BATCH_SIZE < rawData.length) {
      await new Promise(res => setTimeout(res, 2000));
    }
  }

  console.log('\n--- IMPORT SUMMARY REPORT ---');
  console.log(JSON.stringify(stats, null, 2));
  console.log('-----------------------------');
  
  console.log(`Import completed. Successfully processed ${stats.success}/${stats.total} records.`);
  process.exit(0);
};

// Check for --dry-run flag
const isDryRun = process.argv.includes('--dry-run');
runImport(isDryRun);
