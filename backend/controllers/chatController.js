import { extractFiltersFromMessage, generateExplanation } from '../services/geminiService.js';
import { getRecommendations } from '../services/recommendationEngine.js';

export const handleExtract = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }
    const filters = await extractFiltersFromMessage(message, []);
    res.status(200).json({ success: true, filters });
  } catch (error) {
    console.error('Chat Extract Error:', error);
    res.status(500).json({ success: false, message: 'Server Error extracting filters' });
  }
};

export const handleChat = async (req, res) => {
  try {
    const { message, history, mode = 'chat', filters: providedFilters } = req.body;
    
    if (!message && !providedFilters) {
      return res.status(400).json({ success: false, message: 'Message or filters are required.' });
    }

    // 1. Use provided filters or extract requirements using Gemini
    let filters = providedFilters;
    if (!filters && message) {
      filters = await extractFiltersFromMessage(message, history);
    }
    
    // Fallback if Gemini fails or returns null
    if (!filters) {
      filters = { budget: null, fuelType: null, bodyType: null, familySize: null, transmission: null, condition: null };
    }

    // 2. Query MongoDB via Recommendation Engine
    const recommendations = await getRecommendations(filters);

    if (recommendations.length === 0) {
      return res.status(200).json({
        success: true,
        filters,
        recommendations: [],
        aiExplanation: "I couldn't find any cars matching those exact strict criteria. Try adjusting your budget or preferences!"
      });
    }

    // 3. Generate natural language explanation using Gemini
    let aiExplanation = await generateExplanation(message, filters, recommendations, mode);

    res.status(200).json({
      success: true,
      filters,
      recommendations,
      aiExplanation
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ success: false, message: 'Server Error processing chat' });
  }
};
