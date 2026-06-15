import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';

dotenv.config();

// The Authoritative Ground Truth Dictionary
const CAR_TRUTH = {
  'Tata': {
    'Nexon': { type: 'SUV', minPrice: 8, maxPrice: 15, fuelTypes: ['Petrol', 'Diesel', 'Electric'] },
    'Harrier': { type: 'SUV', minPrice: 15, maxPrice: 25, fuelTypes: ['Diesel'] },
    'Safari': { type: 'SUV', minPrice: 16, maxPrice: 27, fuelTypes: ['Diesel'] },
    'Punch': { type: 'SUV', minPrice: 6, maxPrice: 10, fuelTypes: ['Petrol', 'CNG', 'Electric'] },
    'Altroz': { type: 'Hatchback', minPrice: 6, maxPrice: 11, fuelTypes: ['Petrol', 'Diesel', 'CNG'] },
    'Tiago': { type: 'Hatchback', minPrice: 5, maxPrice: 9, fuelTypes: ['Petrol', 'CNG', 'Electric'] },
    'Tigor': { type: 'Sedan', minPrice: 6, maxPrice: 9, fuelTypes: ['Petrol', 'CNG', 'Electric'] }
  },
  'Mahindra': {
    'Scorpio-N': { type: 'SUV', minPrice: 13, maxPrice: 24, fuelTypes: ['Petrol', 'Diesel'] },
    'XUV700': { type: 'SUV', minPrice: 14, maxPrice: 26, fuelTypes: ['Petrol', 'Diesel'] },
    'Thar': { type: 'SUV', minPrice: 11, maxPrice: 17, fuelTypes: ['Petrol', 'Diesel'] },
    'XUV300': { type: 'SUV', minPrice: 8, maxPrice: 14, fuelTypes: ['Petrol', 'Diesel'] },
    'Bolero': { type: 'SUV', minPrice: 9, maxPrice: 11, fuelTypes: ['Diesel'] },
    'Marazzo': { type: 'MUV', minPrice: 14, maxPrice: 17, fuelTypes: ['Diesel'] }
  },
  'Maruti': {
    'Swift': { type: 'Hatchback', minPrice: 6, maxPrice: 9, fuelTypes: ['Petrol', 'CNG'] },
    'Baleno': { type: 'Hatchback', minPrice: 6, maxPrice: 10, fuelTypes: ['Petrol', 'CNG'] },
    'Brezza': { type: 'SUV', minPrice: 8, maxPrice: 14, fuelTypes: ['Petrol', 'CNG'] },
    'Ertiga': { type: 'MUV', minPrice: 8, maxPrice: 13, fuelTypes: ['Petrol', 'CNG'] },
    'Dzire': { type: 'Sedan', minPrice: 6, maxPrice: 9, fuelTypes: ['Petrol', 'CNG'] },
    'WagonR': { type: 'Hatchback', minPrice: 5, maxPrice: 7, fuelTypes: ['Petrol', 'CNG'] },
    'Alto K10': { type: 'Hatchback', minPrice: 4, maxPrice: 6, fuelTypes: ['Petrol', 'CNG'] },
    'Grand Vitara': { type: 'SUV', minPrice: 10, maxPrice: 20, fuelTypes: ['Petrol', 'CNG'] }
  },
  'Hyundai': {
    'Creta': { type: 'SUV', minPrice: 11, maxPrice: 20, fuelTypes: ['Petrol', 'Diesel'] },
    'Venue': { type: 'SUV', minPrice: 7, maxPrice: 13, fuelTypes: ['Petrol', 'Diesel'] },
    'i20': { type: 'Hatchback', minPrice: 7, maxPrice: 11, fuelTypes: ['Petrol'] },
    'Grand i10 Nios': { type: 'Hatchback', minPrice: 5, maxPrice: 8, fuelTypes: ['Petrol', 'CNG'] },
    'Verna': { type: 'Sedan', minPrice: 11, maxPrice: 17, fuelTypes: ['Petrol'] },
    'Tucson': { type: 'SUV', minPrice: 29, maxPrice: 35, fuelTypes: ['Petrol', 'Diesel'] },
    'Alcazar': { type: 'SUV', minPrice: 16, maxPrice: 21, fuelTypes: ['Petrol', 'Diesel'] }
  },
  'Kia': {
    'Seltos': { type: 'SUV', minPrice: 10, maxPrice: 20, fuelTypes: ['Petrol', 'Diesel'] },
    'Sonet': { type: 'SUV', minPrice: 7, maxPrice: 14, fuelTypes: ['Petrol', 'Diesel'] },
    'Carens': { type: 'MUV', minPrice: 10, maxPrice: 19, fuelTypes: ['Petrol', 'Diesel'] },
    'EV6': { type: 'SUV', minPrice: 60, maxPrice: 65, fuelTypes: ['Electric'] },
    'Carnival': { type: 'MUV', minPrice: 30, maxPrice: 35, fuelTypes: ['Diesel'] }
  },
  'Toyota': {
    'Fortuner': { type: 'SUV', minPrice: 33, maxPrice: 51, fuelTypes: ['Petrol', 'Diesel'] },
    'Innova Crysta': { type: 'MUV', minPrice: 19, maxPrice: 26, fuelTypes: ['Diesel'] },
    'Glanza': { type: 'Hatchback', minPrice: 6, maxPrice: 10, fuelTypes: ['Petrol', 'CNG'] },
    'Urban Cruiser Hyryder': { type: 'SUV', minPrice: 11, maxPrice: 20, fuelTypes: ['Petrol', 'CNG'] },
    'Camry': { type: 'Sedan', minPrice: 46, maxPrice: 47, fuelTypes: ['Petrol', 'Hybrid'] }
  },
  'Honda': {
    'City': { type: 'Sedan', minPrice: 11, maxPrice: 16, fuelTypes: ['Petrol', 'Hybrid'] },
    'Amaze': { type: 'Sedan', minPrice: 7, maxPrice: 10, fuelTypes: ['Petrol'] },
    'Elevate': { type: 'SUV', minPrice: 11, maxPrice: 16, fuelTypes: ['Petrol'] }
  },
  'Volkswagen': {
    'Taigun': { type: 'SUV', minPrice: 11, maxPrice: 20, fuelTypes: ['Petrol'] },
    'Virtus': { type: 'Sedan', minPrice: 11, maxPrice: 19, fuelTypes: ['Petrol'] },
    'Tiguan': { type: 'SUV', minPrice: 35, maxPrice: 36, fuelTypes: ['Petrol'] }
  },
  'Skoda': {
    'Kushaq': { type: 'SUV', minPrice: 11, maxPrice: 20, fuelTypes: ['Petrol'] },
    'Slavia': { type: 'Sedan', minPrice: 11, maxPrice: 19, fuelTypes: ['Petrol'] },
    'Kodiaq': { type: 'SUV', minPrice: 38, maxPrice: 40, fuelTypes: ['Petrol'] }
  },
  'MG': {
    'Hector': { type: 'SUV', minPrice: 15, maxPrice: 22, fuelTypes: ['Petrol', 'Diesel'] },
    'Astor': { type: 'SUV', minPrice: 10, maxPrice: 18, fuelTypes: ['Petrol'] },
    'Gloster': { type: 'SUV', minPrice: 38, maxPrice: 43, fuelTypes: ['Diesel'] },
    'ZS EV': { type: 'SUV', minPrice: 22, maxPrice: 28, fuelTypes: ['Electric'] }
  }
};

const auditDataQuality = async () => {
  console.log('--- PRODUCTION DATA QUALITY AUDIT START ---\n');
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const cars = await Car.find();
    console.log(`Analyzing ${cars.length} active records in MongoDB...\n`);

    let inaccuracies = 0;
    let placeholderCount = 0;
    let missingSpecs = 0;
    let issues = [];

    cars.forEach(car => {
      const truth = CAR_TRUTH[car.brand]?.[car.model];
      if (!truth) return; // Skip if we don't have ground truth for this model

      let carIssues = [];

      // 1. Check Vehicle Type Accuracy
      if (car.type !== truth.type) {
        carIssues.push(`Type Mismatch: Is '${car.type}', should be '${truth.type}'`);
      }

      // 2. Check Fuel Type Accuracy
      if (!truth.fuelTypes.includes(car.fuel_type)) {
        carIssues.push(`Fuel Mismatch: '${car.fuel_type}' is invalid for this model`);
      }

      // 3. Price Realism Check
      // Base variance is 15%. Used cars can depreciate up to 70% based on age/condition.
      let lowerBoundMultiplier = car.condition === 'used' ? 0.30 : 0.85; 
      const minPrice = truth.minPrice * lowerBoundMultiplier; 
      const maxPrice = truth.maxPrice * 1.15;
      if (car.price_in_lakhs < minPrice || car.price_in_lakhs > maxPrice) {
        carIssues.push(`Price Unrealistic: ${car.price_in_lakhs}L is out of bounds [${minPrice.toFixed(1)}L - ${maxPrice.toFixed(1)}L]`);
      }

      // 4. API Ninjas Placeholder check
      if (!car.apiNinjasSyncDate) {
        missingSpecs++;
      }

      if (carIssues.length > 0) {
        inaccuracies++;
        placeholderCount++;
        if (issues.length < 10) {
          issues.push(`[${car.brand} ${car.model}]: ${carIssues.join(' | ')}`);
        }
      }
    });

    const qualityScore = Math.max(0, 100 - ((inaccuracies / cars.length) * 100)).toFixed(1);

    console.log(`Total Records Audited: ${cars.length}`);
    console.log(`Total Inaccurate Records: ${inaccuracies}`);
    console.log(`Total Placeholder/Randomized Records: ${placeholderCount}`);
    console.log(`Records Missing API Specs: ${missingSpecs}`);
    console.log(`\n🔴 DATA QUALITY SCORE: ${qualityScore} / 100\n`);

    if (issues.length > 0) {
      console.log('--- Top 10 Inaccuracies Detected ---');
      issues.forEach(i => console.log(i));
      console.log('------------------------------------\n');
    }

    console.log('RECOMMENDED CORRECTIONS:');
    console.log('- Re-author scripts/generateDataset.js to map directly to CAR_TRUTH dictionaries.');
    console.log('- Prevent random assignment of `type` and `fuel_type`.');
    console.log('- Constrain `price_in_lakhs` to realistic bounds for the specific model.');
    console.log('- Wipe existing MongoDB database and execute migration.\n');

    process.exit(0);
  } catch (error) {
    console.error('Audit failed:', error.message);
    process.exit(1);
  }
};

auditDataQuality();
