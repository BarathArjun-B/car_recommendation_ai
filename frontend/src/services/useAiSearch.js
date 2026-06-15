import { useState, useEffect, useCallback } from 'react';
import apiClient from './apiClient';

// Basic cache for debounced searches to avoid duplicate API calls
const searchCache = new Map();

export const useAiSearch = (initialPreferences, onFiltersExtracted) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Hardcoded smart suggestions for the autocomplete dropdown
  const SMART_SUGGESTIONS = [
    "Need a family SUV under 15 lakhs",
    "Best automatic car for city driving",
    "Petrol car with good mileage",
    "5 seater under 10 lakhs",
    "Show Tata cars only",
    "Electric cars for daily commute",
    "Safe cars under 8 lakhs"
  ];

  // Debounced API call
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    // Simple local autocomplete filtering
    const filtered = SMART_SUGGESTIONS.filter(s => 
      s.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSuggestions(filtered);

    // Debounce the extraction call by 800ms
    const timer = setTimeout(async () => {
      const query = searchTerm.trim().toLowerCase();
      
      if (searchCache.has(query)) {
        onFiltersExtracted(searchCache.get(query));
        return;
      }

      setIsExtracting(true);
      try {
        const response = await apiClient.post('/chat/extract', { message: query });
        if (response.data.success && response.data.filters) {
          searchCache.set(query, response.data.filters);
          onFiltersExtracted(response.data.filters);
        }
      } catch (error) {
        console.error('Failed to extract filters', error);
      } finally {
        setIsExtracting(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    isExtracting,
    suggestions,
    showSuggestions,
    setShowSuggestions
  };
};
