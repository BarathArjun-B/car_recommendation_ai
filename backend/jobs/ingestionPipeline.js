import Car from '../models/Car.js';
import { fetchCarSpecsFromApiNinjas } from '../services/apiNinjasService.js';
import { fetchCarImageFromUnsplash } from '../services/unsplashService.js';

/**
 * Normalizes and enriches raw car data from a public dataset.
 * Uses API Ninjas for missing specs and Unsplash for imagery.
 */
export const processAndUpsertCar = async (rawCar) => {
  try {
    const {
      brand,
      model,
      variant,
      type,
      condition,
      price_in_lakhs,
      mileage_kmpl,
      fuel_type,
      transmission,
      year,
      ownerCount,
      kilometersDriven,
      sourceId,
    } = rawCar;

    // 1. Fetch Specs
    const specs = await fetchCarSpecsFromApiNinjas(brand, model);
    
    // 2. Fetch Image
    const imageInfo = await fetchCarImageFromUnsplash(brand, model);
    
    // 3. Normalize Data
    const slug = `${brand}-${model}-${variant || year}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finalSourceId = sourceId || slug;

    const carData = {
      source: 'public-dataset',
      sourceId: finalSourceId,
      slug,
      brand,
      model,
      variant: variant || '',
      type,
      condition: condition || 'used',
      price_in_lakhs,
      mileage_kmpl,
      fuel_type,
      transmission,
      year,
      ownerCount: ownerCount || 1,
      kilometersDriven: kilometersDriven || 0,
      image_url: imageInfo?.url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
      unsplashImageId: imageInfo?.id || null,
      apiNinjasSyncDate: specs ? new Date() : null,
      drivetrain: specs?.drive || null,
      specs: {
        engine: specs?.displacement ? `${specs.displacement}L` : rawCar.specs?.engine,
        seatingCapacity: rawCar.specs?.seatingCapacity || 5,
        safetyRating: rawCar.specs?.safetyRating || 'Not Rated',
      },
      lastSyncedAt: new Date(),
    };

    // 4. Upsert MongoDB
    await Car.findOneAndUpdate(
      { sourceId: finalSourceId },
      { $set: carData },
      { upsert: true, new: true }
    );
    
    return {
      success: true,
      hasImage: !!imageInfo?.url,
      hasSpecs: !!specs,
    };
  } catch (error) {
    console.error(`Failed to process car ${rawCar.brand} ${rawCar.model}:`, error.message);
    return {
      success: false,
      hasImage: false,
      hasSpecs: false,
      error: error.message
    };
  }
};
