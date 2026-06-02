import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, '..', 'logs');
const logFile = path.join(logDirectory, 'events.log');

export const ensureLogDirectory = () => {
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }
};

export const appendLog = async (message) => {
  ensureLogDirectory();
  await fs.promises.appendFile(logFile, `${message}\n`, 'utf8');
};

export const readLogs = async () => {
  ensureLogDirectory();
  try {
    return await fs.promises.readFile(logFile, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return '';
    throw error;
  }
};
