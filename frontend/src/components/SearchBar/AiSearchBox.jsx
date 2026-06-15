import React, { useRef, useEffect } from 'react';

const AiSearchBox = ({ 
  searchTerm, 
  setSearchTerm, 
  suggestions, 
  showSuggestions, 
  setShowSuggestions, 
  isExtracting, 
  onSearch 
}) => {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        setShowSuggestions(false);
        onSearch();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        setSearchTerm(suggestions[selectedIndex]);
      }
      setShowSuggestions(false);
      onSearch(); // Trigger full search
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    onSearch();
  };

  return (
    <div className="relative w-full mb-8 z-50" ref={dropdownRef}>
      <div className={`relative flex items-center w-full bg-white rounded-2xl border-2 transition-all duration-300 shadow-sm ${showSuggestions ? 'border-indigo-400 shadow-md ring-4 ring-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
        
        {/* Search Icon */}
        <div className="pl-5 pr-3 text-indigo-500">
          {isExtracting ? (
             <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI... e.g. 'Need a family SUV under 15 lakhs'"
          className="w-full py-4 text-lg text-gray-800 bg-transparent outline-none placeholder-gray-400"
          autoComplete="off"
        />

        {/* Keyboard Shortcut Hint */}
        <div className="hidden sm:flex pr-4 items-center space-x-1 text-gray-400">
          <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 border border-gray-200 rounded-md">⌘</kbd>
          <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 border border-gray-200 rounded-md">K</kbd>
        </div>

        {/* Search Button */}
        <button 
          onClick={() => { setShowSuggestions(false); onSearch(); }}
          className="mr-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all"
        >
          Search
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-down">
          <ul className="py-2">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`px-5 py-3 cursor-pointer flex items-center transition-colors ${index === selectedIndex ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AiSearchBox;
