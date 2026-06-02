import axios from 'axios';

const mapExternalCar = (raw, index) => {
  const brand = raw.brand || raw.make || raw.company;
  const model = raw.model || raw.name || raw.variant;
  const sourceId = String(raw.id || raw.slug || `${brand}-${model}-${raw.year || index}`).toLowerCase();

  return {
    source: raw.source || 'http-feed',
    sourceId,
    slug: raw.slug || sourceId.replace(/[^a-z0-9]+/g, '-'),
    brand,
    model,
    type: raw.type || raw.bodyType || raw.body_type || 'SUV',
    condition: raw.condition || 'new',
    price_in_lakhs: Number(raw.price_in_lakhs || raw.priceLakhs || raw.price || 0),
    mileage_kmpl: Number(raw.mileage_kmpl || raw.mileage || 0),
    fuel_type: raw.fuel_type || raw.fuelType || 'Petrol',
    transmission: raw.transmission || 'Manual',
    image_url: raw.image_url || raw.image || raw.imageUrl,
    year: Number(raw.year || new Date().getFullYear()),
    ownerCount: Number(raw.ownerCount || 0),
    kilometersDriven: Number(raw.kilometersDriven || raw.kmDriven || 0),
    specs: raw.specs || {},
    features: raw.features || [],
    sourceUrl: raw.sourceUrl,
    lastSyncedAt: new Date(),
  };
};

export const fetchHttpFeedCars = async () => {
  if (!process.env.INGESTION_API_URL) {
    return [];
  }

  const response = await axios.get(process.env.INGESTION_API_URL, {
    timeout: 15000,
    headers: process.env.INGESTION_API_KEY
      ? { Authorization: `Bearer ${process.env.INGESTION_API_KEY}` }
      : undefined,
  });

  const rows = Array.isArray(response.data) ? response.data : response.data.cars || response.data.data || [];
  return rows.map(mapExternalCar).filter((car) => car.brand && car.model && car.image_url);
};
