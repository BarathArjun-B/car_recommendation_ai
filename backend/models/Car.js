import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
      default: 'manual',
    },
    sourceId: {
      type: String,
      required: [true, 'Source id is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Body type is required'],
      enum: ['SUV', 'Sedan', 'Hatchback', 'MUV', 'Coupe', 'EV'],
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['new', 'used'],
    },
    price_in_lakhs: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    mileage_kmpl: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage cannot be negative'],
    },
    fuel_type: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
    },
    transmission: {
      type: String,
      required: [true, 'Transmission is required'],
      enum: ['Manual', 'Automatic', 'DCT', 'CVT', 'AMT'],
    },
    image_url: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1990, 'Year is too old'],
    },
    ownerCount: {
      type: Number,
      required: [true, 'Owner count is required'],
      min: [0, 'Owner count cannot be negative'],
    },
    kilometersDriven: {
      type: Number,
      required: [true, 'Kilometers driven is required'],
      min: [0, 'Kilometers driven cannot be negative'],
    },
    specs: {
      engine: String,
      seatingCapacity: Number,
      safetyRating: String,
      rangeKm: Number,
      torque: String,
      power: String,
    },
    features: {
      type: [String],
      default: [],
    },
    sourceUrl: String,
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

carSchema.index({ source: 1, sourceId: 1 }, { unique: true });
carSchema.index({ slug: 1 }, { unique: true });
carSchema.index({ condition: 1, brand: 1, fuel_type: 1, transmission: 1, type: 1, price_in_lakhs: 1 });
carSchema.index({ brand: 'text', model: 'text', type: 'text', fuel_type: 'text', transmission: 'text' });

const Car = mongoose.model('Car', carSchema);

export default Car;
