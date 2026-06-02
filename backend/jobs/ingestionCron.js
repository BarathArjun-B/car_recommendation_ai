import cron from 'node-cron';
import { ingestCars } from '../services/ingestionService.js';
import eventLogger from '../utils/eventLogger.js';

export const startIngestionCron = () => {
  if (process.env.INGESTION_ENABLED !== 'true') {
    console.log('Car ingestion cron is disabled. Set INGESTION_ENABLED=true to enable scheduled updates.');
    return null;
  }

  const schedule = process.env.INGESTION_CRON || '0 */6 * * *';

  if (!cron.validate(schedule)) {
    throw new Error(`Invalid INGESTION_CRON value: ${schedule}`);
  }

  return cron.schedule(schedule, async () => {
    try {
      const result = await ingestCars();
      console.log(`Scheduled car ingestion completed: ${JSON.stringify(result)}`);
    } catch (error) {
      eventLogger.emit('ingestionFailed', { message: error.message });
      console.error(`Scheduled car ingestion failed: ${error.message}`);
    }
  });
};
