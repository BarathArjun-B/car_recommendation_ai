import { ingestCars } from '../services/ingestionService.js';

export const syncCars = async (req, res, next) => {
  try {
    const result = await ingestCars();
    res.status(200).json({
      success: true,
      message: 'Car ingestion completed',
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const getIngestionStatus = async (req, res) => {
  res.status(200).json({
    success: true,
    ingestionEnabled: process.env.INGESTION_ENABLED === 'true',
    provider: process.env.INGESTION_PROVIDER || 'local',
    cron: process.env.INGESTION_CRON || '0 */6 * * *',
  });
};
