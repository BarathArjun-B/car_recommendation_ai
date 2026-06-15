import React from 'react';

const ChatButton = ({ isOpen, toggleOpen, badgeCount }) => {
  return (
    <button
      onClick={toggleOpen}
      className={`fixed bottom-6 right-6 p-4 w-16 h-16 rounded-full shadow-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-300 z-[999] flex items-center justify-center border border-slate-700 hover:scale-105 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      aria-label="Open BAVH AI Assistant"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
      
      {/* Notification Badge */}
      {badgeCount > 0 && !isOpen && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full animate-pulse shadow-sm border-2 border-white">
          {badgeCount}
        </span>
      )}
    </button>
  );
};

export default ChatButton;
