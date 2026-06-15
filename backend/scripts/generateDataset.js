import fs from 'fs';
import path from 'path';

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

const variants = ['Base', 'Mid', 'Top', 'Top-Optional', 'Sport', 'Luxury'];
const conditions = ['new', 'used'];
const transmissions = ['Manual', 'Automatic', 'AMT', 'DCT'];

const generateCars = (count) => {
  const cars = [];
  const brands = Object.keys(CAR_TRUTH);

  for (let i = 0; i < count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const models = Object.keys(CAR_TRUTH[brand]);
    const model = models[Math.floor(Math.random() * models.length)];
    const truth = CAR_TRUTH[brand][model];

    const variant = variants[Math.floor(Math.random() * variants.length)];
    const type = truth.type; // Strict assignment
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const fuel_type = truth.fuelTypes[Math.floor(Math.random() * truth.fuelTypes.length)]; // Strict assignment
    
    // EV/Hybrid transmission overrides
    let transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
    if (fuel_type === 'Electric') transmission = 'Automatic';

    const year = 2018 + Math.floor(Math.random() * 7);
    
    // Price interpolation based on variant level
    const variantMultiplier = variants.indexOf(variant) / (variants.length - 1); // 0.0 to 1.0
    let price_in_lakhs = truth.minPrice + (truth.maxPrice - truth.minPrice) * variantMultiplier;
    
    // Depreciation logic for used cars
    if (condition === 'used') {
      const age = new Date().getFullYear() - year;
      price_in_lakhs = price_in_lakhs * (1 - (age * 0.10)); // 10% depreciation per year
    }
    price_in_lakhs = parseFloat(Math.max(price_in_lakhs, truth.minPrice * 0.4).toFixed(2)); // Floor

    // Realistic Mileage
    let mileage_kmpl;
    if (fuel_type === 'Electric') {
      mileage_kmpl = 350 + Math.floor(Math.random() * 150); // Range in km
    } else if (fuel_type === 'Diesel') {
      mileage_kmpl = 16 + Math.random() * 6;
    } else if (fuel_type === 'CNG') {
      mileage_kmpl = 22 + Math.random() * 8;
    } else {
      mileage_kmpl = 12 + Math.random() * 6; // Petrol
    }
    
    // SUVs have lower mileage
    if (type === 'SUV' && fuel_type !== 'Electric') mileage_kmpl -= 3;
    mileage_kmpl = parseFloat(Math.max(mileage_kmpl, 8).toFixed(1));

    const car = {
      brand,
      model,
      variant,
      type,
      condition,
      price_in_lakhs,
      mileage_kmpl,
      fuel_type,
      transmission,
      year
    };
    
    if (condition === 'used') {
      car.ownerCount = 1 + Math.floor(Math.random() * 2);
      car.kilometersDriven = 15000 + Math.floor(Math.random() * 70000);
    }
    
    cars.push(car);
  }
  return cars;
};

const cars = generateCars(110);
const filePath = path.resolve('data/indian_cars_dataset.json');

// Ensure data directory exists
const dataDir = path.dirname(filePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(filePath, JSON.stringify(cars, null, 2));
console.log(`Successfully generated ${cars.length} perfectly mapped cars into ${filePath}`);
