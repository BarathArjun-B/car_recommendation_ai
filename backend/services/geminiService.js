import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let ai = null;

const getAIClient = () => {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
};

const DEFAULT_MODEL = 'gemini-2.5-flash';

/**
 * Phase 3: AI Requirement Extraction
 * Extracts structured car preferences from a natural language query and conversation history.
 */
const regexExtractFilters = (msg) => {
  const text = msg.toLowerCase();
  const filters = {
    budget: null,
    fuelType: null,
    bodyType: null,
    familySize: null,
    transmission: null,
    condition: null,
    usage: null,
    brand: null,
    mileagePreference: null,
    safetyPreference: null
  };

  const budgetMatch = text.match(/(?:under|below|max|budget)\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|l|)/i) || text.match(/(\d+(?:\.\d+)?)\s*(?:lakhs?|l)\s*(?:budget)/i);
  if (budgetMatch) filters.budget = parseFloat(budgetMatch[1]);

  const bodyMatch = text.match(/(suv|sedan|hatchback|muv|ev)/i);
  if (bodyMatch) {
    let type = bodyMatch[1].toUpperCase();
    if (type === 'EV') type = 'SUV'; // Some mapping if needed, but let's keep it exact:
    filters.bodyType = bodyMatch[1].toUpperCase();
  }

  if (text.match(/(family|7 seater|children|kids|parents|long trips)/i)) {
    filters.familySize = 5;
    if (text.match(/(7|seven)\s*seater/i)) filters.familySize = 7;
    filters.usage = 'family';
  }

  if (text.match(/(automatic|amt|at)/i)) filters.transmission = 'Automatic';
  if (text.match(/(manual|mt)/i)) filters.transmission = 'Manual';

  return filters;
};

export const extractFiltersFromMessage = async (message, history = []) => {
  const client = getAIClient();
  if (!client) {
    console.warn('[GEMINI] API Key missing, using regex extraction fallback.');
    return regexExtractFilters(message);
  }

  const prompt = `
You are an expert Indian Car Recommendation AI assistant.
Your job is to extract search filters from the user's message.

Consider the user's latest message and their previous conversation context.
Return ONLY a raw, valid JSON object with the exact following schema. Do NOT wrap it in markdown blockquotes like \`\`\`json. Return just the raw JSON.

Schema:
{
  "budget": number | null, // in Lakhs (e.g., 15 lakhs -> 15). Try to extract max budget.
  "fuelType": string | null, // e.g., "Petrol", "Diesel", "CNG", "Electric", "Hybrid"
  "bodyType": string | null, // e.g., "SUV", "Sedan", "Hatchback", "MUV"
  "familySize": number | null, // e.g., 5
  "transmission": string | null, // "Automatic" or "Manual" (treat AMT/DCT as Automatic)
  "condition": string | null, // "new" or "used"
  "usage": string | null, // "City" or "Highway"
  "brand": string | null, // e.g., "Tata", "Hyundai", "Maruti"
  "mileagePreference": string | null, // e.g., "High", "Standard"
  "safetyPreference": string | null // e.g., "High", "Standard"
}

CRITICAL RULES:
1. If the user mentions "family", "family car", or "family SUV", you MUST set "familySize" to 5.
2. If the user mentions "SUV", you MUST set "bodyType" to "SUV".
3. If the user mentions "Sedan", you MUST set "bodyType" to "Sedan".
4. If the user mentions "automatic", "AMT", or "AT", you MUST set "transmission" to "Automatic".

Examples:
User: "Need a family SUV under 15 lakhs" -> {"budget": 15, "bodyType": "SUV", "familySize": 5, "fuelType": null, "transmission": null, "condition": null, "usage": null, "brand": null, "mileagePreference": null, "safetyPreference": null}
User: "Best sedan for city driving" -> {"budget": null, "bodyType": "Sedan", "familySize": null, "fuelType": null, "transmission": null, "condition": null, "usage": "City", "brand": null, "mileagePreference": null, "safetyPreference": null}
User: "Automatic family SUV" -> {"budget": null, "bodyType": "SUV", "familySize": 5, "fuelType": null, "transmission": "Automatic", "condition": null, "usage": null, "brand": null, "mileagePreference": null, "safetyPreference": null}

Conversation Context:
${history.map(h => `${h.role}: ${h.text}`).join('\n')}

User's Latest Message:
${message}
  `;

  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Gemini Extraction Timeout')), 4000)
    );

    const generatePromise = client.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.1, // Low temperature for deterministic extraction
      }
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    let rawText = response.text.trim();
    console.log('[DEBUG] GEMINI RAW RESPONSE:', rawText);
    
    // Safely remove markdown if it hallucinated it
    if (rawText.startsWith('```json')) rawText = rawText.substring(7);
    if (rawText.startsWith('```')) rawText = rawText.substring(3);
    if (rawText.endsWith('```')) rawText = rawText.substring(0, rawText.length - 3);

    const geminiFilters = JSON.parse(rawText.trim());
    const regexFilters = regexExtractFilters(message);
    const finalFilters = geminiFilters;

    console.log(
      "[FILTER_DEBUG]",
      JSON.stringify({
        source: "geminiService",
        geminiFilters,
        regexFilters,
        finalFilters
      }, null, 2)
    );

    return geminiFilters;
  } catch (error) {
    console.error('[GEMINI EXTRACTION ERROR]', error.message);
    const fallback = regexExtractFilters(message);
    console.log('[DEBUG] REGEX FALLBACK USED:', fallback);
    return fallback;
  }
};

/**
 * Phase 5: AI Explanation Layer
 * Generates personalized reasoning for why specific cars were recommended.
 */
export const generateExplanation = async (userMessage, filters, topCars, mode = 'chat') => {
  const client = getAIClient();
  if (!client) {
    return mode === 'chat' 
      ? "These are the top matches based on our algorithm. (Gemini AI explanations disabled due to missing API key)."
      : "• System algorithm match\n• Manual verification required";
  }

  const carsSummary = topCars.map((c, i) => 
    `#${i + 1}: ${c.brand} ${c.model} (${c.matchPercentage}% Match) - Starts at ₹${c.startingPrice}L, Fuels: ${c.fuelOptions.join(', ')}, Transmissions: ${c.transmissionOptions.join(', ')}`
  ).join('\n');

  let prompt = '';

  if (mode === 'bullets') {
    prompt = `
You are an expert Indian Car Recommendation AI.
The user asked: "${userMessage}"
We extracted these filters: ${JSON.stringify(filters)}
Our internal database engine scored and selected these top cars:
${carsSummary}

You MUST return a valid JSON array containing objects. Each object must have a "carId" field matching the exact car model name, and an "explanation" array containing 5 short strings (bullet points starting with ✓).
Do NOT wrap in markdown \`\`\`json blocks. Return ONLY raw JSON.

Example format:
[
  {
    "carModel": "Creta",
    "explanation": [
      "✓ Fits your 15 lakh budget",
      "✓ Comfortable for 5 passengers",
      "✓ Excellent city driving experience",
      "✓ Good resale value",
      "✓ High safety rating"
    ]
  }
]
    `;
  } else if (mode === 'detailed_json') {
    prompt = `
You are an expert Indian Car Recommendation AI.
The user asked: "${userMessage}"
We extracted these filters: ${JSON.stringify(filters)}
Our internal database engine scored and selected these top cars:
${carsSummary}

You MUST return a valid JSON array containing objects. Each object must represent a car from the list and use the exact schema below.
Do NOT wrap in markdown \`\`\`json blocks. Return ONLY raw JSON.

Schema per object:
{
  "carModel": "Model Name",
  "whyRecommended": "Brief paragraph explaining why this car matches their specific needs.",
  "strengths": ["Short pro 1", "Short pro 2"],
  "weaknesses": ["Short con 1"],
  "familySuitability": "Brief comment on family usage",
  "citySuitability": "Brief comment on city usage",
  "highwaySuitability": "Brief comment on highway usage"
}
    `;
  } else {
    prompt = `
You are an expert Indian Car Recommendation AI.
The user asked: "${userMessage}"
We extracted these filters: ${JSON.stringify(filters)}
Our internal database engine scored and selected these top cars:
${carsSummary}

Please write a highly engaging, friendly, and concise message to the user presenting these recommendations. 

For EVERY single car in the list, you MUST generate the following exact format using markdown:

### [Car Brand] [Car Model]
**[X]% Match**

**Why Recommended:**
✓ [Point explaining why it fits their filters]
✓ [Point explaining suitability (e.g. family/city)]
✓ [Point about budget or features]

**Pros:**
• [Short Pro 1]
• [Short Pro 2]

**Cons:**
• [Short Con 1]

Keep the formatting exceptionally clean. Do NOT invent cars or prices.
    `;
  }

  try {
    // Set a strict 5-second timeout so we don't hang the frontend
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Gemini API Timeout (Rate limit or slow)')), 5000)
    );

    const generatePromise = client.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        temperature: (mode === 'bullets_json' || mode === 'detailed_json') ? 0.1 : 0.7,
      }
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    let rawText = response.text.trim();
    
    if (mode === 'bullets_json' || mode === 'detailed_json') {
      if (rawText.startsWith('```json')) rawText = rawText.substring(7);
      if (rawText.startsWith('```')) rawText = rawText.substring(3);
      if (rawText.endsWith('```')) rawText = rawText.substring(0, rawText.length - 3);
      return JSON.parse(rawText.trim());
    }

    return rawText;
  } catch (error) {
    console.error('[GEMINI EXPLANATION ERROR]', error.message);
    
    // Hard Fallback to prevent "failed to generate" errors
    if (mode === 'bullets_json') {
      return topCars.map(c => ({
        carModel: c.model,
        explanation: [
          `✓ ${c.matchPercentage}% algorithm match`,
          `✓ ${c.internalReason || 'Matches your preferences'}`,
          `✓ Starting at ₹${c.startingPrice} Lakhs`,
          `✓ Fuels: ${c.fuelOptions.join(', ')}`,
          `✓ Database verified`
        ]
      }));
    } else if (mode === 'detailed_json') {
      return topCars.map(c => {
        const bd = filters.bodyType ? `${filters.bodyType} body style requested` : `Excellent build quality`;
        const bg = filters.budget ? `Fits ₹${filters.budget} lakh budget` : `Starts at ₹${c.startingPrice} Lakhs`;
        const fs = filters.familySize ? `Family-friendly cabin for ${filters.familySize}` : `Comfortable seating configuration`;
        
        return {
          carModel: c.model,
          whyRecommended: c.internalReason ? `This ${c.brand} model is highly recommended: ${c.internalReason.toLowerCase()}` : `This ${c.brand} model is a strong ${c.matchPercentage}% match.`,
          strengths: [bd, bg, fs, `Internal score: ${c.matchPercentage}%`],
          weaknesses: ["Cannot analyze specific cons without AI"],
          familySuitability: filters.familySize ? `Ideal for ${filters.familySize} passengers.` : "Good space and comfort.",
          citySuitability: "Efficient maneuverability.",
          highwaySuitability: "Stable at high speeds."
        };
      });
    }

    // Chat mode fallback
    return `### Top Recommendations\n\n` + topCars.map(c => `**${c.brand} ${c.model} (${c.matchPercentage}% Match)**\n* **Why it was selected:** ${c.internalReason || 'Matches your core search preferences.'}\n* **Options:** ${c.fuelOptions.join(', ')} | ${c.transmissionOptions.join(', ')}\n* **Starting Price:** ₹${c.startingPrice} Lakhs\n`).join('\n\n');
  }
};
