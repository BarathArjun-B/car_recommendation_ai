import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Car.js';

dotenv.config();

const auditDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- MONGODB AUDIT START ---\n');

    const totalRecords = await Car.countDocuments();
    console.log(`1. Total car records: ${totalRecords}`);

    const withSpecs = await Car.countDocuments({ apiNinjasSyncDate: { $ne: null } });
    console.log(`2. Records with real specifications (API Ninjas): ${withSpecs}`);

    const withImages = await Car.countDocuments({ unsplashImageId: { $ne: null } });
    console.log(`3. Records with valid image URLs (Unsplash): ${withImages}`);

    const brands = await Car.distinct('brand');
    console.log(`4. Found ${brands.length} distinct brands.`);
    
    console.log(`5. API Ninjas enrichment active usage: ${withSpecs > 0 ? 'YES' : 'NO'}`);
    console.log(`6. Unsplash image enrichment active usage: ${withImages > 0 ? 'YES' : 'NO'}`);

    const placeholders = await Car.countDocuments({ 
      $or: [
        { apiNinjasSyncDate: null },
        { unsplashImageId: null },
        { source: 'local-seed' },
        { source: 'public-dataset', apiNinjasSyncDate: null }
      ]
    });
    console.log(`7. Records using placeholder/fallback values: ${placeholders}`);

    const missingFields = await Car.countDocuments({
      $or: [
        { price_in_lakhs: { $exists: false } },
        { mileage_kmpl: { $exists: false } },
        { type: { $exists: false } },
        { fuel_type: { $exists: false } }
      ]
    });
    console.log(`8. Records missing critical recommendation fields (price, mileage, type, fuel): ${missingFields}`);

    console.log('\n--- SAMPLE DATA FROM DIFFERENT BRANDS ---');
    const samples = await Car.aggregate([
      { $group: { _id: "$brand", car: { $first: "$$ROOT" } } },
      { $limit: 10 }
    ]);
    
    samples.forEach(s => {
      console.log(`Brand: ${s._id} | Model: ${s.car.model} | Image: ${s.car.image_url.substring(0,30)}... | Specs Sync: ${s.car.apiNinjasSyncDate ? 'Yes' : 'No'}`);
    });

    console.log('\n--- MONGODB AUDIT END ---');
    process.exit(0);
  } catch (error) {
    console.error('Audit failed:', error.message);
    process.exit(1);
  }
};

auditDB();
