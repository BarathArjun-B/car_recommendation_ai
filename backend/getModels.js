import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const carSchema = new mongoose.Schema({ brand: String, model: String });
const Car = mongoose.model('Car', carSchema, 'cars');

async function run() {
  const models = await Car.distinct('model');
  const brands = await Car.aggregate([{ $group: { _id: "$brand", models: { $addToSet: "$model" } } }]);
  console.log(JSON.stringify(brands, null, 2));
  process.exit();
}
run();
