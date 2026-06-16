import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const migrateData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    const Car = mongoose.models.Car || mongoose.model('Car', new mongoose.Schema({}, { strict: false }));

    const cars = await Car.find();
    console.log(`Found ${cars.length} total cars.`);

    let deletedCount = 0;
    const variantsMap = new Map();

    const idsToDelete = [];

    cars.forEach(car => {
      // Create a unique key for deduplication
      const key = `${car.brand}-${car.model}-${car.variant}-${car.year}-${car.condition}-${car.transmission}`;
      
      if (variantsMap.has(key)) {
        idsToDelete.push(car._id);
      } else {
        variantsMap.set(key, car._id);
      }
    });

    if (idsToDelete.length > 0) {
      console.log(`Found ${idsToDelete.length} duplicate variants. Deleting...`);
      const result = await Car.deleteMany({ _id: { $in: idsToDelete } });
      deletedCount = result.deletedCount;
      console.log(`Successfully deleted ${deletedCount} duplicates.`);
    } else {
      console.log('No duplicates found. Database is clean.');
    }

    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrateData();
