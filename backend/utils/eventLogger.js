import { EventEmitter } from 'events';
import { appendLog } from './fileHandler.js';

class AppEventLogger extends EventEmitter {}

const eventLogger = new AppEventLogger();

const writeEvent = async (eventName, payload) => {
  try {
    await appendLog(JSON.stringify({ event: eventName, payload, createdAt: new Date().toISOString() }));
  } catch (error) {
    console.error(`Failed to write event log: ${error.message}`);
  }
};

eventLogger.on('serverStarted', (payload) => writeEvent('serverStarted', payload));
eventLogger.on('userRegistered', (payload) => writeEvent('userRegistered', payload));
eventLogger.on('userLoggedIn', (payload) => writeEvent('userLoggedIn', payload));
eventLogger.on('carViewed', (payload) => writeEvent('carViewed', payload));
eventLogger.on('carsIngested', (payload) => writeEvent('carsIngested', payload));
eventLogger.on('ingestionFailed', (payload) => writeEvent('ingestionFailed', payload));

export default eventLogger;
