import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env variables are loaded
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  console.error('❌ API_BASE_URL is not set in your .env file. Please set it before running these scripts.');
  process.exit(1);
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export default apiClient;
