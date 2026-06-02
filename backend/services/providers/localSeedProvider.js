import { loadBackendJson } from '../../utils/loadJson.js';

const seedCars = loadBackendJson('data/seedCars.json');

export const fetchLocalSeedCars = async () =>
  seedCars.map((car) => ({
    ...car,
    source: car.source || 'local-seed',
    sourceId: car.sourceId || car.slug,
    lastSyncedAt: new Date(),
  }));
