import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

async function check() {
  if (!uri) throw new Error("MONGO_URI not defined");
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const countNew = await db.collection('cars').countDocuments({ condition: 'new' });
  const countUsed = await db.collection('cars').countDocuments({ condition: 'used' });
  const countAll = await db.collection('cars').countDocuments({});
  console.log(`New: ${countNew}, Used: ${countUsed}, Total: ${countAll}`);
  const sample = await db.collection('cars').findOne({});
  console.log('Sample:', sample);
  process.exit(0);
}
check();
