import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadBackendJson = (relativePath) => {
  const fullPath = path.join(__dirname, '..', relativePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
};
