import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Car from '../models/Car.js';

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!UNSPLASH_KEY) {
  console.warn("⚠️ UNSPLASH_ACCESS_KEY is not defined. Will use fallback placeholders.");
}

// ==================================================
// PHASE 1: MASTER CATALOG DEFINITION
// ==================================================

const BRANDS = {
  "Maruti Suzuki": [
    { model: "Swift", type: "Hatchback", basePrice: 6.0, fuels: ["Petrol", "CNG"], transmissions: ["Manual", "AMT"], variants: ["LXi", "VXi", "ZXi", "ZXi+"] },
    { model: "Baleno", type: "Hatchback", basePrice: 6.6, fuels: ["Petrol", "CNG"], transmissions: ["Manual", "AMT"], variants: ["Sigma", "Delta", "Zeta", "Alpha"] },
    { model: "WagonR", type: "Hatchback", basePrice: 5.5, fuels: ["Petrol", "CNG"], transmissions: ["Manual", "AMT"], variants: ["LXi", "VXi", "ZXi"] },
    { model: "Dzire", type: "Sedan", basePrice: 6.5, fuels: ["Petrol", "CNG"], transmissions: ["Manual", "AMT"], variants: ["LXi", "VXi", "ZXi", "ZXi+"] },
    { model: "Fronx", type: "SUV", basePrice: 7.5, fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic", "AMT"], variants: ["Sigma", "Delta", "Zeta", "Alpha"] },
    { model: "Brezza", type: "SUV", basePrice: 8.3, fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["LXi", "VXi", "ZXi", "ZXi+"] },
    { model: "Grand Vitara", type: "SUV", basePrice: 10.7, fuels: ["Petrol", "CNG", "Hybrid"], transmissions: ["Manual", "Automatic", "CVT"], variants: ["Sigma", "Delta", "Zeta", "Alpha", "Alpha+"] },
    { model: "Ertiga", type: "MUV", basePrice: 8.6, fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["LXi", "VXi", "ZXi", "ZXi+"] },
    { model: "XL6", type: "MUV", basePrice: 11.6, fuels: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"], variants: ["Zeta", "Alpha", "Alpha+"] }
  ],
  "Hyundai": [
    { model: "i20", type: "Hatchback", basePrice: 7.0, fuels: ["Petrol"], transmissions: ["Manual", "CVT", "DCT"], variants: ["Era", "Magna", "Sportz", "Asta", "Asta (O)"] },
    { model: "Venue", type: "SUV", basePrice: 7.9, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "DCT"], variants: ["E", "S", "S(O)", "SX", "SX(O)"] },
    { model: "Exter", type: "SUV", basePrice: 6.1, fuels: ["Petrol", "CNG"], transmissions: ["Manual", "AMT"], variants: ["EX", "S", "SX", "SX(O)"] },
    { model: "Verna", type: "Sedan", basePrice: 11.0, fuels: ["Petrol"], transmissions: ["Manual", "CVT", "DCT"], variants: ["EX", "S", "SX", "SX(O)"] },
    { model: "Creta", type: "SUV", basePrice: 11.0, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic", "CVT", "DCT"], variants: ["E", "EX", "S", "SX", "SX(O)"] },
    { model: "Alcazar", type: "SUV", basePrice: 16.7, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic", "DCT"], variants: ["Prestige", "Platinum", "Signature"] }
  ],
  "Tata": [
    { model: "Tiago", type: "Hatchback", basePrice: 5.6, fuels: ["Petrol", "CNG", "Electric"], transmissions: ["Manual", "AMT"], variants: ["XE", "XM", "XT", "XZ+"] },
    { model: "Tigor", type: "Sedan", basePrice: 6.3, fuels: ["Petrol", "CNG", "Electric"], transmissions: ["Manual", "AMT"], variants: ["XE", "XM", "XZ", "XZ+"] },
    { model: "Punch", type: "SUV", basePrice: 6.1, fuels: ["Petrol", "CNG", "Electric"], transmissions: ["Manual", "AMT"], variants: ["Pure", "Adventure", "Accomplished", "Creative"] },
    { model: "Altroz", type: "Hatchback", basePrice: 6.6, fuels: ["Petrol", "Diesel", "CNG"], transmissions: ["Manual", "DCT"], variants: ["XE", "XM", "XT", "XZ", "XZ+"] },
    { model: "Nexon", type: "SUV", basePrice: 8.1, fuels: ["Petrol", "Diesel", "Electric", "CNG"], transmissions: ["Manual", "AMT", "DCT"], variants: ["Smart", "Pure", "Creative", "Fearless"] },
    { model: "Harrier", type: "SUV", basePrice: 15.4, fuels: ["Diesel"], transmissions: ["Manual", "Automatic"], variants: ["Smart", "Pure", "Adventure", "Fearless"] },
    { model: "Safari", type: "SUV", basePrice: 16.1, fuels: ["Diesel"], transmissions: ["Manual", "Automatic"], variants: ["Smart", "Pure", "Adventure", "Accomplished"] },
    { model: "Curvv", type: "SUV", basePrice: 10.5, fuels: ["Petrol", "Diesel", "Electric"], transmissions: ["Manual", "DCT"], variants: ["Smart", "Pure", "Creative", "Accomplished"] }
  ],
  "Mahindra": [
    { model: "Bolero", type: "SUV", basePrice: 9.9, fuels: ["Diesel"], transmissions: ["Manual"], variants: ["B4", "B6", "B6(O)"] },
    { model: "XUV 3XO", type: "SUV", basePrice: 7.4, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["MX1", "MX2", "AX5", "AX7", "AX7L"] },
    { model: "Thar", type: "SUV", basePrice: 11.3, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["AX(O)", "LX"] },
    { model: "Scorpio N", type: "SUV", basePrice: 13.6, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["Z2", "Z4", "Z6", "Z8", "Z8L"] },
    { model: "XUV700", type: "SUV", basePrice: 13.9, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["MX", "AX3", "AX5", "AX7", "AX7L"] }
  ],
  "Kia": [
    { model: "Sonet", type: "SUV", basePrice: 7.9, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic", "DCT", "AMT"], variants: ["HTE", "HTK", "HTK+", "HTX", "GTX+"] },
    { model: "Seltos", type: "SUV", basePrice: 10.9, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic", "CVT", "DCT"], variants: ["HTE", "HTK", "HTK+", "HTX", "GTX+"] },
    { model: "Carens", type: "MUV", basePrice: 10.5, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic", "DCT"], variants: ["Premium", "Prestige", "Luxury", "Luxury Plus"] },
    { model: "Syros", type: "SUV", basePrice: 9.0, fuels: ["Petrol", "Diesel", "Electric"], transmissions: ["Manual", "Automatic"], variants: ["HTE", "HTK", "HTX", "GTX"] }
  ],
  "Toyota": [
    { model: "Glanza", type: "Hatchback", basePrice: 6.8, fuels: ["Petrol", "CNG"], transmissions: ["Manual", "AMT"], variants: ["E", "S", "G", "V"] },
    { model: "Urban Cruiser", type: "SUV", basePrice: 9.0, fuels: ["Petrol"], transmissions: ["Manual", "Automatic"], variants: ["Mid", "High", "Premium"] },
    { model: "Hyryder", type: "SUV", basePrice: 11.1, fuels: ["Petrol", "CNG", "Hybrid"], transmissions: ["Manual", "Automatic", "CVT"], variants: ["E", "S", "G", "V"] },
    { model: "Innova Crysta", type: "MUV", basePrice: 19.9, fuels: ["Diesel"], transmissions: ["Manual"], variants: ["G", "GX", "VX", "ZX"] },
    { model: "Innova Hycross", type: "MUV", basePrice: 19.7, fuels: ["Petrol", "Hybrid"], transmissions: ["CVT", "Automatic"], variants: ["G", "GX", "VX", "ZX(O)"] },
    { model: "Fortuner", type: "SUV", basePrice: 33.4, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"], variants: ["4x2", "4x4", "Legender"] }
  ],
  "Honda": [
    { model: "Amaze", type: "Sedan", basePrice: 7.1, fuels: ["Petrol"], transmissions: ["Manual", "CVT"], variants: ["E", "S", "VX"] },
    { model: "City", type: "Sedan", basePrice: 11.8, fuels: ["Petrol", "Hybrid"], transmissions: ["Manual", "CVT"], variants: ["SV", "V", "VX", "ZX"] },
    { model: "Elevate", type: "SUV", basePrice: 11.5, fuels: ["Petrol"], transmissions: ["Manual", "CVT"], variants: ["SV", "V", "VX", "ZX"] }
  ],
  "MG": [
    { model: "Comet", type: "Hatchback", basePrice: 6.9, fuels: ["Electric"], transmissions: ["Automatic"], variants: ["Pace", "Play", "Plush"] },
    { model: "Astor", type: "SUV", basePrice: 9.9, fuels: ["Petrol"], transmissions: ["Manual", "CVT", "Automatic"], variants: ["Sprint", "Shine", "Select", "Sharp", "Savvy"] },
    { model: "Hector", type: "SUV", basePrice: 13.9, fuels: ["Petrol", "Diesel"], transmissions: ["Manual", "CVT"], variants: ["Style", "Shine", "Smart", "Sharp Pro", "Savvy Pro"] },
    { model: "ZS EV", type: "SUV", basePrice: 18.9, fuels: ["Electric"], transmissions: ["Automatic"], variants: ["Executive", "Excite", "Exclusive", "Essence"] },
    { model: "Windsor EV", type: "SUV", basePrice: 13.5, fuels: ["Electric"], transmissions: ["Automatic"], variants: ["Excite", "Exclusive", "Essence"] }
  ],
  "Volkswagen": [
    { model: "Virtus", type: "Sedan", basePrice: 11.5, fuels: ["Petrol"], transmissions: ["Manual", "Automatic", "DCT"], variants: ["Comfortline", "Highline", "Topline", "GT Plus"] },
    { model: "Taigun", type: "SUV", basePrice: 11.7, fuels: ["Petrol"], transmissions: ["Manual", "Automatic", "DCT"], variants: ["Comfortline", "Highline", "Topline", "GT Plus"] }
  ],
  "Skoda": [
    { model: "Slavia", type: "Sedan", basePrice: 10.6, fuels: ["Petrol"], transmissions: ["Manual", "Automatic", "DCT"], variants: ["Active", "Ambition", "Style"] },
    { model: "Kushaq", type: "SUV", basePrice: 10.8, fuels: ["Petrol"], transmissions: ["Manual", "Automatic", "DCT"], variants: ["Active", "Ambition", "Style", "Monte Carlo"] },
    { model: "Kylaq", type: "SUV", basePrice: 7.8, fuels: ["Petrol"], transmissions: ["Manual", "Automatic"], variants: ["Active", "Ambition", "Style"] }
  ],
  "Renault": [
    { model: "Kwid", type: "Hatchback", basePrice: 4.6, fuels: ["Petrol"], transmissions: ["Manual", "AMT"], variants: ["RXE", "RXL", "RXT", "Climber"] },
    { model: "Kiger", type: "SUV", basePrice: 6.0, fuels: ["Petrol"], transmissions: ["Manual", "AMT", "CVT"], variants: ["RXE", "RXL", "RXT", "RXZ"] },
    { model: "Triber", type: "MUV", basePrice: 6.0, fuels: ["Petrol"], transmissions: ["Manual", "AMT"], variants: ["RXE", "RXL", "RXT", "RXZ"] }
  ],
  "Nissan": [
    { model: "Magnite", type: "SUV", basePrice: 5.9, fuels: ["Petrol"], transmissions: ["Manual", "AMT", "CVT"], variants: ["XE", "XL", "XV", "XV Premium"] },
    { model: "X-Trail", type: "SUV", basePrice: 49.9, fuels: ["Petrol"], transmissions: ["CVT"], variants: ["Premium"] }
  ]
};

// ==================================================
// HELPER FUNCTIONS
// ==================================================

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateSlug = (brand, model, variant, year) => {
  const text = `${brand} ${model} ${variant} ${year} ${Math.floor(Math.random() * 10000)}`;
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const getMileage = (fuelType, bodyType) => {
  if (fuelType === 'Electric') return getRandomInt(300, 500); // Range
  if (fuelType === 'Hybrid') return getRandomInt(22, 28);
  if (fuelType === 'CNG') return getRandomInt(24, 32);
  if (fuelType === 'Diesel') return getRandomInt(15, 22);
  
  if (bodyType === 'SUV') return getRandomInt(11, 18);
  if (bodyType === 'Hatchback') return getRandomInt(18, 23);
  return getRandomInt(14, 20); // Sedan/MUV
};

// Phase 5 Pricing Engine
const calculatePrice = (basePrice, condition, year, variantIndex, totalVariants) => {
  // Variant multiplier (higher variants cost more)
  const variantMultiplier = 1 + (variantIndex * 0.12);
  let finalPrice = basePrice * variantMultiplier;

  if (condition === 'used') {
    const age = new Date().getFullYear() - year;
    let depreciation = 0;
    if (age === 1) depreciation = 0.10;
    else if (age === 2) depreciation = 0.18;
    else if (age === 3) depreciation = 0.25;
    else if (age === 4) depreciation = 0.32;
    else if (age >= 5) depreciation = 0.40;

    finalPrice = finalPrice * (1 - depreciation);
  }

  return Number(finalPrice.toFixed(2));
};

// ==================================================
// PHASE 6 & 7: IMAGE STRATEGY
// ==================================================
const imageCache = new Map();

const fetchImageForModel = async (brand, model) => {
  const key = `${brand}-${model}`;
  if (imageCache.has(key)) return imageCache.get(key);

  let imageUrl = `https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800`; // Fallback generic car

  if (UNSPLASH_KEY) {
    try {
      // Small delay to prevent rate limits
      await delay(200);
      const query = `${brand} ${model} car`;
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, per_page: 1, orientation: 'landscape' },
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
      });
      if (response.data.results && response.data.results.length > 0) {
        imageUrl = response.data.results[0].urls.regular;
      }
    } catch (err) {
      console.warn(`Unsplash limit reached or error for ${query}: ${err.message}. Using fallback.`);
    }
  }

  imageCache.set(key, imageUrl);
  return imageUrl;
};

// ==================================================
// PHASE 2, 3, 4: GENERATION ENGINE
// ==================================================

const generateCars = async () => {
  const cars = [];
  const currentYear = new Date().getFullYear();

  for (const [brand, models] of Object.entries(BRANDS)) {
    console.log(`Generating catalog for ${brand}...`);
    
    for (const car of models) {
      // 1. Fetch Model Image ONCE
      const imageUrl = await fetchImageForModel(brand, car.model);

      for (let vIdx = 0; vIdx < car.variants.length; vIdx++) {
        const variant = car.variants[vIdx];

        // Generate multiple instances per variant to reach 1000-3000 count
        // For each variant, we create 3 new cars (different fuels/transmissions)
        // and 8 used cars (different years/conditions)
        
        // --- Generate NEW Cars ---
        for (let i = 0; i < 2; i++) {
          const fuel = getRandomItem(car.fuels);
          // EVs don't have manual
          const trans = fuel === 'Electric' ? 'Automatic' : getRandomItem(car.transmissions);
          const price = calculatePrice(car.basePrice, 'new', currentYear, vIdx, car.variants.length);

          cars.push({
            source: 'system-migration',
            sourceId: `new-${brand}-${car.model}-${variant}-${Date.now()}-${Math.random()}`,
            slug: generateSlug(brand, car.model, variant, currentYear),
            brand,
            model: car.model,
            variant,
            type: car.type,
            condition: 'new',
            year: currentYear,
            fuel_type: fuel,
            transmission: trans,
            price_in_lakhs: price,
            mileage_kmpl: getMileage(fuel, car.type),
            image_url: imageUrl,
            ownerCount: 0,
            kilometersDriven: getRandomInt(10, 50),
            specs: {
              seatingCapacity: car.type === 'MUV' ? 7 : (car.type === 'SUV' ? getRandomItem([5, 7]) : 5),
              safetyRating: `${getRandomInt(3, 5)} Star`,
              rangeKm: fuel === 'Electric' ? getMileage(fuel, car.type) : null
            }
          });
        }

        // --- Generate USED Cars ---
        for (let i = 0; i < 5; i++) {
          const fuel = getRandomItem(car.fuels);
          const trans = fuel === 'Electric' ? 'Automatic' : getRandomItem(car.transmissions);
          const year = getRandomInt(2018, 2023);
          const price = calculatePrice(car.basePrice, 'used', year, vIdx, car.variants.length);

          cars.push({
            source: 'system-migration',
            sourceId: `used-${brand}-${car.model}-${variant}-${Date.now()}-${Math.random()}`,
            slug: generateSlug(brand, car.model, variant, year),
            brand,
            model: car.model,
            variant,
            type: car.type,
            condition: 'used',
            year: year,
            fuel_type: fuel,
            transmission: trans,
            price_in_lakhs: price,
            mileage_kmpl: getMileage(fuel, car.type),
            image_url: imageUrl,
            ownerCount: getRandomInt(1, 3),
            kilometersDriven: getRandomInt(15000, 85000),
            specs: {
              seatingCapacity: car.type === 'MUV' ? 7 : (car.type === 'SUV' ? getRandomItem([5, 7]) : 5),
              safetyRating: `${getRandomInt(3, 5)} Star`,
              rangeKm: fuel === 'Electric' ? getMileage(fuel, car.type) : null
            }
          });
        }
      }
    }
  }

  return cars;
};

// ==================================================
// PHASE 8, 9, 10: MIGRATION & EXECUTION
// ==================================================

const runMigration = async () => {
  try {
    console.log("======================================");
    console.log("🚗 BAVH MOTORS AI - CATALOG MIGRATION");
    console.log("======================================");

    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not found in .env");

    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected.");

    console.log("🧹 Purging existing car records...");
    await Car.deleteMany({});
    console.log("✅ Database Purged.");

    console.log("⚙️ Generating realistic Indian Car Catalog...");
    const masterCatalog = await generateCars();

    console.log(`💾 Inserting ${masterCatalog.length} records into MongoDB...`);
    await Car.insertMany(masterCatalog);
    console.log("✅ Insertion Complete.");

    console.log("🏗️ Rebuilding Indexes...");
    await Car.syncIndexes();
    console.log("✅ Indexes Rebuilt.");

    // ==================================================
    // PHASE 10: VALIDATION REPORT
    // ==================================================
    console.log("\n======================================");
    console.log("📊 VALIDATION REPORT");
    console.log("======================================");

    const totalCount = await Car.countDocuments();
    console.log(`Total Records: ${totalCount}`);

    const brandStats = await Car.aggregate([{ $group: { _id: "$brand", count: { $sum: 1 } } }]);
    console.log("\n--- Records by Brand ---");
    brandStats.forEach(b => console.log(`${b._id}: ${b.count}`));

    const fuelStats = await Car.aggregate([{ $group: { _id: "$fuel_type", count: { $sum: 1 } } }]);
    console.log("\n--- Records by Fuel Type ---");
    fuelStats.forEach(f => console.log(`${f._id}: ${f.count}`));

    const typeStats = await Car.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]);
    console.log("\n--- Records by Body Type ---");
    typeStats.forEach(t => console.log(`${t._id}: ${t.count}`));

    const condStats = await Car.aggregate([{ $group: { _id: "$condition", count: { $sum: 1 } } }]);
    console.log("\n--- Records by Condition ---");
    condStats.forEach(c => console.log(`${c._id}: ${c.count}`));

    console.log("\n✅ Migration successfully completed!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Migration Failed:", error);
    process.exit(1);
  }
};

runMigration();
