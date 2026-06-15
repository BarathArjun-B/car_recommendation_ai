import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractFiltersFromMessage } from '../services/geminiService.js';
import { getRecommendations } from '../services/recommendationEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const queries = [
  "Family SUV under 15 lakhs",
  "Sedan under 12 lakhs",
  "EV under 20 lakhs",
  "7-seater family car"
];

const runAudit = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("=========================================");
  console.log("    RECOMMENDATION ENGINE QUALITY AUDIT  ");
  console.log("=========================================\n");

  for (const query of queries) {
    console.log(`\nTEST QUERY: "${query}"`);
    console.log("-----------------------------------------");
    
    // 1. Extract Filters
    console.log("1. Extracting Filters via Gemini...");
    let filters;
    try {
      filters = await extractFiltersFromMessage(query, []);
    } catch (e) {
      console.log("Gemini Extraction Error/Rate Limit. Falling back to mocked exact filters for testing.");
      if (query.includes("SUV")) filters = { budget: 15, bodyType: "SUV", familySize: 5 };
      else if (query.includes("Sedan")) filters = { budget: 12, bodyType: "Sedan" };
      else if (query.includes("EV")) filters = { budget: 20, fuelType: "Electric" };
      else if (query.includes("7-seater")) filters = { familySize: 7 };
    }
    
    if (!filters) {
      // Manual fallback if extraction is strictly null
      if (query.includes("SUV")) filters = { budget: 15, bodyType: "SUV", familySize: 5 };
      else if (query.includes("Sedan")) filters = { budget: 12, bodyType: "Sedan" };
      else if (query.includes("EV")) filters = { budget: 20, fuelType: "Electric" };
      else if (query.includes("7-seater")) filters = { familySize: 7 };
    }
    console.log("Extracted Filters:", JSON.stringify(filters));

    // 2. Mock what the Recommendation Engine dbQuery would look like:
    let dbQuery = {};
    if (filters.bodyType && filters.bodyType.toLowerCase() !== 'any') {
      dbQuery.type = new RegExp('^' + filters.bodyType + '$', 'i');
    } else if (filters.familySize > 5) {
      dbQuery.type = { $in: [new RegExp('^suv$', 'i'), new RegExp('^muv$', 'i')] };
    }
    console.log("MongoDB Query:", JSON.stringify({ type: dbQuery.type ? dbQuery.type.toString() : 'ALL' }));

    // 3. Get Recommendations
    const recs = await getRecommendations(filters);
    
    // 4. Output Results
    console.log(`Found ${recs.length} clusters (unique models)`);
    recs.forEach((rec, idx) => {
      console.log(`  ${idx + 1}. ${rec.brand} ${rec.model} | Score: ${rec.matchPercentage}% | Starting at ₹${rec.startingPrice}L`);
      console.log(`     -> ${rec.internalReason}`);
      // Show first 2 variants to prove we prevent duplicate models but aggregate variants
      const vars = rec.variants.slice(0, 2).map(v => `${v.variant} (₹${v.price_in_lakhs}L)`).join(', ');
      console.log(`     -> Variants: ${vars}${rec.variants.length > 2 ? ' ...' : ''}`);
    });
    console.log("-----------------------------------------");
  }

  process.exit(0);
};

runAudit().catch(console.error);
