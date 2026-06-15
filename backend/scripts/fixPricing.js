import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MASTER_PRICING = {
  // MARUTI SUZUKI
  "Swift": { min: 6.0, max: 10.0 },
  "Baleno": { min: 7.0, max: 11.0 },
  "WagonR": { min: 5.5, max: 8.5 },
  "Dzire": { min: 6.5, max: 10.5 },
  "Fronx": { min: 7.5, max: 13.5 },
  "Brezza": { min: 8.5, max: 14.5 },
  "Grand Vitara": { min: 11.0, max: 20.0 },
  "Ertiga": { min: 9.0, max: 14.0 },
  "XL6": { min: 11.5, max: 15.0 },

  // HYUNDAI
  "i20": { min: 7.0, max: 12.0 },
  "Venue": { min: 8.0, max: 14.0 },
  "Exter": { min: 6.5, max: 10.5 },
  "Verna": { min: 11.0, max: 18.0 },
  "Creta": { min: 11.0, max: 20.0 },
  "Alcazar": { min: 16.5, max: 21.5 },

  // TATA
  "Tiago": { min: 5.5, max: 8.5 },
  "Tigor": { min: 6.5, max: 9.5 },
  "Punch": { min: 6.0, max: 10.5 },
  "Altroz": { min: 6.5, max: 11.0 },
  "Nexon": { min: 8.0, max: 16.0 },
  "Harrier": { min: 15.5, max: 24.5 },
  "Safari": { min: 16.5, max: 27.5 },
  "Curvv": { min: 10.5, max: 19.5 },

  // MAHINDRA
  "Bolero": { min: 9.5, max: 11.5 },
  "XUV 3XO": { min: 7.5, max: 15.5 },
  "Thar": { min: 11.5, max: 18.0 },
  "Scorpio N": { min: 13.5, max: 24.5 },
  "XUV700": { min: 14.0, max: 30.0 },

  // KIA
  "Sonet": { min: 8.0, max: 16.0 },
  "Seltos": { min: 11.0, max: 21.0 },
  "Carens": { min: 10.5, max: 20.0 },
  "Syros": { min: 9.0, max: 16.0 }, // Estimate based on Sonet/Seltos gap

  // TOYOTA
  "Glanza": { min: 7.0, max: 10.5 },
  "Urban Cruiser": { min: 9.0, max: 12.0 }, // Discontinued, but historical
  "Hyryder": { min: 11.0, max: 20.5 },
  "Innova Crysta": { min: 19.0, max: 28.0 },
  "Innova Hycross": { min: 19.0, max: 36.0 },
  "Fortuner": { min: 35.0, max: 60.0 },

  // HONDA
  "Amaze": { min: 7.5, max: 10.0 },
  "City": { min: 12.0, max: 18.0 },
  "Elevate": { min: 11.0, max: 18.0 },

  // MG
  "Astor": { min: 10.0, max: 18.5 },
  "Hector": { min: 14.0, max: 22.5 },
  "Comet": { min: 7.0, max: 9.5 },
  "ZS EV": { min: 19.0, max: 26.0 },
  "Windsor EV": { min: 10.0, max: 15.5 },

  // SKODA
  "Kylaq": { min: 8.0, max: 14.0 },
  "Kushaq": { min: 11.0, max: 20.5 },
  "Slavia": { min: 11.0, max: 19.0 },

  // VOLKSWAGEN
  "Taigun": { min: 11.5, max: 21.0 },
  "Virtus": { min: 11.0, max: 20.0 },

  // RENAULT
  "Kwid": { min: 4.5, max: 6.5 },
  "Triber": { min: 6.0, max: 9.0 },
  "Kiger": { min: 6.0, max: 11.5 },

  // NISSAN
  "Magnite": { min: 6.0, max: 11.5 },
  "X-Trail": { min: 30.0, max: 40.0 } // Estimated for CBU
};

// Year of current pricing reference
const CURRENT_YEAR = 2026; 

// Depreciation Curve (from original price)
const getDepreciationMultiplier = (year) => {
  const age = CURRENT_YEAR - year;
  if (age <= 0) return 1.0; // New
  if (age === 1) return 0.90; // 10%
  if (age === 2) return 0.82; // 18%
  if (age === 3) return 0.75; // 25%
  if (age === 4) return 0.68; // Estimated ~32%
  if (age >= 5) return 0.60; // 40%
  return 0.60;
};

// Generic Variant Tiers (to simulate increasing prices)
const VARIANT_TIERS = {
  // Common terms mapped to a position from 0.0 (Base) to 1.0 (Top)
  "E": 0.0, "Sigma": 0.0, "XE": 0.0, "W4": 0.0, "AX3": 0.2,
  "EX": 0.2, "Delta": 0.3, "XM": 0.3, "W6": 0.4, "AX5": 0.5,
  "S": 0.4, "Zeta": 0.6, "XT": 0.6, "W8": 0.7, "AX7": 0.8,
  "SX": 0.7, "Alpha": 0.9, "XZ": 0.8, "W10": 0.9, "AX7L": 1.0,
  "SX(O)": 1.0, "Alpha+": 1.0, "XZ+": 1.0, "W11": 1.0
};

// Simple hashing to deterministically assign a tier if variant not found
const hashVariant = (variantName) => {
  let hash = 0;
  for (let i = 0; i < variantName.length; i++) {
    hash = variantName.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Return a float between 0.1 and 0.9
  return 0.1 + (Math.abs(hash) % 80) / 100.0; 
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const Car = mongoose.model('Car', new mongoose.Schema({
    brand: String,
    model: String,
    variant: String,
    year: Number,
    price_in_lakhs: Number,
    condition: String
  }, { strict: false }), 'cars');

  const allCars = await Car.find({});
  let updatedCount = 0;
  let totalModelsFound = 0;
  let bulkOps = [];

  for (const car of allCars) {
    const range = MASTER_PRICING[car.model];
    if (!range) {
      console.warn(`WARNING: Missing pricing for model: ${car.model}`);
      continue;
    }
    totalModelsFound++;

    // Calculate position in the min-max range (0.0 to 1.0)
    let position = VARIANT_TIERS[car.variant];
    if (position === undefined) {
      // Find partial match
      const key = Object.keys(VARIANT_TIERS).find(k => car.variant.includes(k));
      if (key) {
        position = VARIANT_TIERS[key];
      } else {
        position = hashVariant(car.variant);
      }
    }

    // Adjust position up slightly if it's an Automatic or EV to reflect premium
    if (car.transmission && car.transmission.toLowerCase().includes('auto')) {
      position = Math.min(1.0, position + 0.15);
    }
    if (car.fuel_type && car.fuel_type.toLowerCase() === 'electric') {
       position = Math.min(1.0, position + 0.2);
    }

    // Calculate Original New Price
    const originalPrice = range.min + (range.max - range.min) * position;

    // Apply Depreciation if used
    let finalPrice = originalPrice;
    if (car.condition === 'used' || car.year < CURRENT_YEAR) {
      const multiplier = getDepreciationMultiplier(car.year);
      finalPrice = originalPrice * multiplier;
    }

    // Round to 2 decimal places
    finalPrice = Math.round(finalPrice * 100) / 100;

    bulkOps.push({
      updateOne: {
        filter: { _id: car._id },
        update: { $set: { price_in_lakhs: finalPrice } }
      }
    });

    updatedCount++;
  }

  if (bulkOps.length > 0) {
    await Car.collection.bulkWrite(bulkOps);
  }

  console.log(`Successfully updated ${updatedCount}/${allCars.length} cars with realistic pricing.`);
  process.exit(0);
};

run().catch(console.error);
