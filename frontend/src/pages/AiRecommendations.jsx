import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAiSearch } from '../services/useAiSearch';
import AiSearchBox from '../components/SearchBar/AiSearchBox';

const AiRecommendations = () => {
  const [preferences, setPreferences] = useState({
    budget: 15,
    familySize: 4,
    usage: 'City',
    fuelType: 'Any',
    condition: 'Any',
    transmission: 'Any',
    bodyType: 'Any'
  });

  const [recommendations, setRecommendations] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Hook handles debounced typing -> calls /api/chat/extract -> returns structured filters
  const { 
    searchTerm, 
    setSearchTerm, 
    isExtracting, 
    suggestions, 
    showSuggestions, 
    setShowSuggestions 
  } = useAiSearch(preferences, (extractedFilters) => {
    // Smart Sync: update UI automatically when AI parses text
    setPreferences(prev => ({
      ...prev,
      budget: extractedFilters.budget || prev.budget,
      familySize: extractedFilters.familySize || prev.familySize,
      fuelType: extractedFilters.fuelType 
        ? (extractedFilters.fuelType.charAt(0).toUpperCase() + extractedFilters.fuelType.slice(1).toLowerCase()) 
        : prev.fuelType,
      transmission: extractedFilters.transmission 
        ? (extractedFilters.transmission.charAt(0).toUpperCase() + extractedFilters.transmission.slice(1).toLowerCase()) 
        : prev.transmission,
      usage: extractedFilters.usage 
        ? (extractedFilters.usage.charAt(0).toUpperCase() + extractedFilters.usage.slice(1).toLowerCase()) 
        : prev.usage,
      condition: extractedFilters.condition || prev.condition,
      bodyType: extractedFilters.bodyType 
        ? (extractedFilters.bodyType.charAt(0).toUpperCase() + extractedFilters.bodyType.slice(1).toLowerCase()) 
        : prev.bodyType
    }));
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: name === 'budget' || name === 'familySize' ? Number(value) : value
    });
  };

  const handleToggle = (name, value) => {
    setPreferences({ ...preferences, [name]: value });
  };

  // Full search generating bullet explanations
  const executeSearch = async (queryMessage = searchTerm) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const payloadMessage = queryMessage.trim() || `Find cars matching my exact filters.`;
      
      // Clean up preferences to send as filters
      const payloadFilters = {
        budget: preferences.budget,
        familySize: preferences.familySize,
        usage: preferences.usage === 'Any' ? null : preferences.usage,
        fuelType: preferences.fuelType === 'Any' ? null : preferences.fuelType,
        condition: preferences.condition === 'Any' ? null : preferences.condition,
        transmission: preferences.transmission === 'Any' ? null : preferences.transmission,
        bodyType: preferences.bodyType === 'Any' ? null : preferences.bodyType
      };

      console.log('--- DEBUG: executeSearch ---');
      console.log('Sending payload:', { message: payloadMessage, filters: payloadFilters, mode: 'detailed_json' });

      const response = await apiClient.post('/chat', { 
        message: payloadMessage,
        filters: payloadFilters,
        mode: 'detailed_json'
      });

      console.log('Received response:', response.data);

      if (response.data.success) {
        setRecommendations(response.data.recommendations || []);
        setExplanations(response.data.aiExplanation || []);
      }
    } catch (err) {
      console.error('--- DEBUG: executeSearch ERROR ---');
      console.error('Full Error Object:', err);
      
      let errorMessage = 'An unexpected error occurred.';
      
      if (err.response) {
        // Backend returned an error status code (4xx, 5xx)
        console.error('Response Data:', err.response.data);
        errorMessage = `Server Error (${err.response.status}): ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        // Request was made but no response received (timeout/network)
        console.error('No Response Received:', err.request);
        errorMessage = 'Network Error: Backend server is unreachable or timed out.';
      } else {
        // Error setting up the request
        console.error('Request Setup Error:', err.message);
        errorMessage = `Client Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  const openChatbot = () => {
    const chatBtn = document.querySelector('[aria-label="Open BAVH AI Assistant"]');
    if (chatBtn) chatBtn.click();
  };

  const getExplanationForCar = (carModel) => {
    if (!Array.isArray(explanations)) return null;
    const match = explanations.find(e => carModel.toLowerCase().includes(e.carModel.toLowerCase()) || e.carModel.toLowerCase().includes(carModel.toLowerCase()));
    return match ? match : null; // Return the whole object instead of just an array
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section with Chat Trigger */}
        <div className="text-center mb-8 relative">
          <button 
            onClick={openChatbot}
            className="absolute right-0 top-0 hidden md:flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg font-bold shadow hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            Chat With AI
          </button>
          
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 sm:text-5xl md:text-6xl tracking-tight">
            AI Match Engine
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Describe what you're looking for, or use the smart filters below.
          </p>
        </div>

        {/* Natural Language AI Search Box */}
        <div className="max-w-4xl mx-auto mb-10">
          <AiSearchBox 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            isExtracting={isExtracting}
            onSearch={() => executeSearch(searchTerm)}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Smart Sync Input Form */}
          <div className="w-full lg:w-1/3 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              Smart Filters
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Budget Slider */}
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Max Budget</span>
                  <span className="text-indigo-600 font-bold">₹{preferences.budget} Lakhs</span>
                </label>
                <input
                  type="range"
                  name="budget"
                  min="3"
                  max="100"
                  step="1"
                  value={preferences.budget}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Family Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Family Size (Seats)</label>
                <input
                  type="number"
                  name="familySize"
                  min="1"
                  max="10"
                  value={preferences.familySize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Primary Usage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Usage</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  {['City', 'Highway'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleToggle('usage', type)}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${preferences.usage === type ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Preference</label>
                <select
                  name="fuelType"
                  value={preferences.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                >
                  {['Any', 'Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                <select
                  name="bodyType"
                  value={preferences.bodyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                >
                  {['Any', 'SUV', 'Sedan', 'Hatchback', 'MUV', 'Coupe', 'Pickup'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  {['Any', 'New', 'Used'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleToggle('condition', c === 'Any' ? 'Any' : c.toLowerCase())}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${preferences.condition === (c === 'Any' ? 'Any' : c.toLowerCase()) ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                <select
                  name="transmission"
                  value={preferences.transmission}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                >
                  {['Any', 'Manual', 'Automatic', 'AMT', 'DCT'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing Market...' : 'Find Matches'}
              </button>
              
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </div>

          {/* Right Column: AI Explanations & Results */}
          <div className="w-full lg:w-2/3">
            {!hasSearched && !loading ? (
              <div className="h-full flex flex-col items-center justify-center bg-indigo-50 border border-indigo-100 rounded-2xl p-12 text-center shadow-inner">
                <svg className="w-24 h-24 text-indigo-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                <h3 className="text-2xl font-bold text-indigo-900 mb-2">Ready for Smart Match?</h3>
                <p className="text-indigo-600 max-w-md">Type what you want in the search bar or use the smart filters. Our AI will instantly find and explain the best cars for you.</p>
              </div>
            ) : loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-200 h-48 md:w-1/3"></div>
                    <div className="p-6 flex-1 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 w-full md:w-1/3 p-6 border-t md:border-t-0 md:border-l border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center bg-red-50 border border-red-100 rounded-2xl p-12 text-center">
                <p className="text-red-500 font-medium text-lg">No cars match these strict criteria. Try adjusting your requirements.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recommendations.map((rec, index) => {
                  const aiBullets = getExplanationForCar(rec.model || (rec.car && rec.car.model));
                  
                  // Handle both clustered and old format
                  const brand = rec.brand || rec.car?.brand;
                  const model = rec.model || rec.car?.model;
                  const imageUrl = rec.image_url || rec.car?.image_url;
                  const price = rec.startingPrice || rec.car?.price_in_lakhs;
                  const fuelOptions = rec.fuelOptions || [rec.car?.fuel_type];
                  const transOptions = rec.transmissionOptions || [rec.car?.transmission];
                  const variants = rec.variants || [rec.car];
                  const keyId = variants[0]?._id || index;

                  return (
                    <div key={keyId} className="group flex flex-col md:flex-row bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                      
                      {/* Left: Image & Specs */}
                      <div className="md:w-5/12 relative flex flex-col">
                        <div className="absolute top-3 left-3 bg-slate-900 text-white font-bold text-xs px-2.5 py-1 rounded shadow-sm z-10">
                          #{index + 1}
                        </div>
                        
                        <div className="h-48 w-full relative">
                          {imageUrl ? (
                            <img src={imageUrl} alt={model} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">No Image</div>
                          )}
                          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded shadow-sm flex items-center border border-green-100">
                            <span className="font-bold text-green-700 text-sm">{rec.matchPercentage}% Match</span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 bg-white border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{brand}</p>
                          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                            {model}
                          </h3>
                          <p className="text-2xl font-black text-indigo-600 mb-4">Starts at ₹{price} Lakh</p>
                          
                          <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600 mb-4">
                            <div className="flex items-center bg-slate-100 px-2 py-1 rounded"><span className="w-3 h-3 mr-1 text-gray-400">⛽</span> {fuelOptions.join(', ')}</div>
                            <div className="flex items-center bg-slate-100 px-2 py-1 rounded"><span className="w-3 h-3 mr-1 text-gray-400">⚙️</span> {transOptions.join(', ')}</div>
                            <div className="flex items-center bg-slate-100 px-2 py-1 rounded font-bold text-indigo-600">{variants.length} Variants</div>
                          </div>
                          
                        </div>
                      </div>

                      {/* Right: AI Logic Panel */}
                      <div className="md:w-7/12 bg-indigo-50/50 p-6 border-t md:border-t-0 md:border-l border-indigo-100/50">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 border border-indigo-200">
                            <span className="text-sm">✨</span>
                          </div>
                          <h4 className="font-bold text-indigo-900">Why {brand} {model}?</h4>
                        </div>
                        
                        {aiBullets ? (
                          <div className="space-y-4">
                            {/* Why Recommended */}
                            <div>
                              <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                                "{aiBullets.whyRecommended}"
                              </p>
                            </div>
                            
                            {/* Pros & Cons Grid */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/60 p-3 rounded-xl border border-green-100">
                                <h5 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                                  Strengths
                                </h5>
                                <ul className="space-y-1">
                                  {aiBullets.strengths?.map((pro, idx) => (
                                    <li key={idx} className="text-xs text-gray-700 flex items-start">
                                      <span className="text-green-500 mr-1.5 mt-0.5">•</span> {pro}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-white/60 p-3 rounded-xl border border-red-100">
                                <h5 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
                                  Weaknesses
                                </h5>
                                <ul className="space-y-1">
                                  {aiBullets.weaknesses?.map((con, idx) => (
                                    <li key={idx} className="text-xs text-gray-700 flex items-start">
                                      <span className="text-red-400 mr-1.5 mt-0.5">•</span> {con}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Suitability */}
                            <div className="bg-white/50 p-3 rounded-xl text-xs space-y-2 border border-indigo-100/50">
                              <div className="flex items-start">
                                <span className="font-bold text-indigo-700 w-20 flex-shrink-0">Family:</span>
                                <span className="text-gray-700">{aiBullets.familySuitability}</span>
                              </div>
                              <div className="flex items-start">
                                <span className="font-bold text-indigo-700 w-20 flex-shrink-0">City:</span>
                                <span className="text-gray-700">{aiBullets.citySuitability}</span>
                              </div>
                              <div className="flex items-start">
                                <span className="font-bold text-indigo-700 w-20 flex-shrink-0">Highway:</span>
                                <span className="text-gray-700">{aiBullets.highwaySuitability}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col h-full justify-center text-sm text-gray-500 italic space-y-2 pb-8">
                            <p className="flex items-start"><span className="text-green-500 font-bold mr-2">✓</span> Database internal match</p>
                            <p className="flex items-start"><span className="text-green-500 font-bold mr-2">✓</span> Selected via filtering logic</p>
                          </div>
                        )}
                        
                        <div className="mt-6 flex gap-2">
                           <button 
                            onClick={openChatbot}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                           >
                             Ask AI about this car <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                           </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AiRecommendations;
