import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Car from '../models/Car.js';

const runAudit = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const models = await Car.aggregate([
    {
      $group: {
        _id: { brand: "$brand", model: "$model", type: "$type" }
      }
    },
    {
      $sort: { "_id.brand": 1, "_id.model": 1 }
    }
  ]);
  
  console.log("=== DB AUDIT: MODEL to BODY TYPE ===");
  models.forEach(m => {
    console.log(`${m._id.brand} ${m._id.model} -> ${m._id.type}`);
  });
  
  process.exit(0);
};

runAudit();
