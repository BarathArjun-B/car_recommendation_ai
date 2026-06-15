import mongoose from 'mongoose';
import Car from '../models/Car.js';
import eventLogger from '../utils/eventLogger.js';
import { clearCache } from './cacheService.js';
import { fetchHttpFeedCars } from './providers/httpFeedProvider.js';
import { fetchLocalSeedCars } from './providers/localSeedProvider.js';
import { fetchScrapedCars } from './providers/scraperProvider.js';
import { processAndUpsertCar } from '../jobs/ingestionPipeline.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

const normalizeCar = (car) => ({
  ...car,
  source: car.source || process.env.INGESTION_PROVIDER || 'manual',
  sourceId: String(car.sourceId || car.slug || `${car.brand}-${car.model}-${car.year}`).toLowerCase(),
  slug: String(car.slug || `${car.brand}-${car.model}-${car.year}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  price_in_lakhs: Number(car.price_in_lakhs),
  mileage_kmpl: Number(car.mileage_kmpl),
  year: Number(car.year),
  ownerCount: Number(car.ownerCount || 0),
  kilometersDriven: Number(car.kilometersDriven || 0),
  lastSyncedAt: new Date(),
});

export const fetchCarsFromConfiguredProvider = async () => {
  const provider = process.env.INGESTION_PROVIDER || 'local';

  if (provider === 'http') return fetchHttpFeedCars();
  if (provider === 'scraper') return fetchScrapedCars();

  return fetchLocalSeedCars();
};

export const ingestCars = async () => {
  if (!isMongoConnected()) {
    const fallbackCars = await fetchLocalSeedCars();
    return {
      source: 'local-fallback',
      inserted: 0,
      updated: 0,
      skipped: fallbackCars.length,
      message: 'MongoDB is not connected. Configure MONGO_URI to persist fetched cars.',
    };
  }

  const fetchedCars = await fetchCarsFromConfiguredProvider();
  let inserted = 0;
  let updated = 0;

  for (const rawCar of fetchedCars) {
    const success = await processAndUpsertCar(rawCar);
    if (success) inserted++; // Simplification: tracking as inserted/processed
  }

  clearCache();
  eventLogger.emit('carsIngested', { inserted, updated, fetched: fetchedCars.length });

  return {
    source: process.env.INGESTION_PROVIDER || 'local',
    inserted,
    updated,
    skipped: Math.max(fetchedCars.length - inserted - updated, 0),
    totalFetched: fetchedCars.length,
  };
};
