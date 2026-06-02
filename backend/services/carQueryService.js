import mongoose from 'mongoose';
import Car from '../models/Car.js';
import { loadBackendJson } from '../utils/loadJson.js';
import { getCache, setCache } from './cacheService.js';

const seedCars = loadBackendJson('data/seedCars.json');

const isMongoConnected = () => mongoose.connection.readyState === 1;

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFilters = (query) => {
  const filters = {};
  const { condition, brand, fuel_type, transmission, bodyType, budget, q } = query;

  if (condition) filters.condition = condition;
  if (brand) filters.brand = new RegExp(`^${escapeRegex(brand)}$`, 'i');
  if (fuel_type) filters.fuel_type = fuel_type;
  if (transmission) filters.transmission = transmission;
  if (bodyType) filters.type = bodyType;
  if (budget) filters.price_in_lakhs = { $lte: Number(budget) };
  if (q) filters.$text = { $search: q };

  return filters;
};

const filterSeedCars = (query) => {
  const { condition, brand, fuel_type, transmission, bodyType, budget, q } = query;
  return seedCars.filter((car) => {
    const text = `${car.brand} ${car.model} ${car.type} ${car.fuel_type} ${car.transmission}`.toLowerCase();
    return (
      (!condition || car.condition === condition) &&
      (!brand || car.brand.toLowerCase() === brand.toLowerCase()) &&
      (!fuel_type || car.fuel_type === fuel_type) &&
      (!transmission || car.transmission === transmission) &&
      (!bodyType || car.type === bodyType) &&
      (!budget || car.price_in_lakhs <= Number(budget)) &&
      (!q || text.includes(q.toLowerCase()))
    );
  });
};

export const queryCars = async (query) => {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 12), 1), 48);
  const skip = (page - 1) * limit;
  const cacheKey = `cars:${JSON.stringify({ ...query, page, limit })}`;
  const cached = getCache(cacheKey);

  if (cached) return cached;

  if (!isMongoConnected()) {
    const filtered = filterSeedCars(query);
    const result = {
      success: true,
      source: 'local-fallback',
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit) || 1,
      cars: filtered.slice(skip, skip + limit),
    };
    setCache(cacheKey, result);
    return result;
  }

  const filters = buildFilters(query);
  const [cars, total] = await Promise.all([
    Car.find(filters).sort({ lastSyncedAt: -1, price_in_lakhs: 1 }).skip(skip).limit(limit).lean(),
    Car.countDocuments(filters),
  ]);

  const result = {
    success: true,
    source: 'mongodb',
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    cars,
  };

  setCache(cacheKey, result);
  return result;
};

export const findCarByIdentifier = async (identifier) => {
  const cacheKey = `car:${identifier}`;
  const cached = getCache(cacheKey);

  if (cached) return cached;

  if (!isMongoConnected()) {
    const car = seedCars.find((item) => item.slug === identifier || item.sourceId === identifier);
    if (!car) return null;
    const result = { success: true, source: 'local-fallback', car };
    setCache(cacheKey, result);
    return result;
  }

  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  const car = await Car.findOne({
    $or: [
      ...(isObjectId ? [{ _id: identifier }] : []),
      { slug: identifier },
      { sourceId: identifier },
    ],
  }).lean();

  if (!car) return null;

  const result = { success: true, source: 'mongodb', car };
  setCache(cacheKey, result);
  return result;
};
