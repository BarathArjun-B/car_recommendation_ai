import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import RecommendationCard from './RecommendationCard';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ 
  isOpen, 
  closeChat, 
  messages, 
  input, 
  setInput, 
  handleSubmit, 
  isLoading, 
  handleChipClick 
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const quickChips = [
    'Family Car', 'SUV', 'EV', 'Under 10 Lakhs', 'Best Mileage'
  ];

  return (
    <div className={`fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[75vh] md:h-[600px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[1000] flex flex-col transition-all duration-300 transform origin-bottom-right glass-panel ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-20 pointer-events-none'}`}>
      
      {/* Header */}
      <div className="bg-slate-900 p-4 rounded-t-2xl flex justify-between items-center text-white shadow-md relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-inner">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">BAVH AI Assistant</h3>
            <p className="text-xs text-slate-400 font-medium">Car Recommendation Expert</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <button onClick={closeChat} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800" aria-label="Minimize Chat">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 chat-scroll-container scroll-smooth flex flex-col relative z-0">
        
        {/* Welcome Message (Static at top if not implicitly in messages array, but user said display on first open. We'll pass it in the initial state of messages in ChatWidget, but we need Quick Chips below the welcome message.) */}
        
        {messages.map((msg, index) => (
          <React.Fragment key={index}>
            {msg.type === 'text' && <MessageBubble message={msg} />}
            
            {/* Quick Action Chips injected after the very first welcome message */}
            {index === 0 && messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 mb-6 ml-2">
                {quickChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="px-3 py-1.5 bg-white border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {msg.type === 'cards' && (
              <div className="w-full flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-4 px-4 snap-x">
                {msg.cards.map((rec, i) => (
                  <div key={i} className="min-w-[85%] snap-center">
                    <RecommendationCard rec={rec} />
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}

        {isLoading && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 rounded-b-2xl relative z-10">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your requirements here..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors shadow-sm"
            aria-label="Send Message"
          >
            <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-400 font-medium">Powered by Google Gemini AI</span>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
