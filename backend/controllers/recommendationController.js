import { getRecommendations } from '../services/recommendationEngine.js';

export const generateRecommendations = async (req, res) => {
  try {
    const preferences = req.body;
    
    // Basic validation
    if (!preferences.budget || typeof preferences.budget !== 'number') {
      return res.status(400).json({ success: false, message: 'Valid budget is required.' });
    }

    const recommendations = await getRecommendations(preferences);
    
    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error('Recommendation Engine Error:', error);
    res.status(500).json({ success: false, message: 'Server Error processing recommendations' });
  }
};
