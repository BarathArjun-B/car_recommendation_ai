import React from 'react';

// Advanced markdown formatter for premium Chat UI
const formatMarkdown = (text) => {
  if (!text) return { __html: '' };
  
  let formatted = text
    // Headers (e.g. ### Top Recommendations)
    .replace(/^### (.*$)/gim, '<h3 className="text-base font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-100">$1</h3>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong className="font-bold text-slate-800">$1</strong>')
    // Bullet points (✓ and •)
    .replace(/^✓ (.*$)/gim, '<div className="flex items-start text-sm mb-1.5"><span className="text-green-500 font-bold mr-2">✓</span><span>$1</span></div>')
    .replace(/^• (.*$)/gim, '<div className="flex items-start text-sm mb-1.5"><span className="text-indigo-400 font-bold mr-2">•</span><span>$1</span></div>')
    .replace(/^\* (.*$)/gim, '<div className="flex items-start text-sm mb-1.5"><span className="text-slate-400 font-bold mr-2">•</span><span>$1</span></div>')
    // Newlines
    .replace(/\n\n/g, '<div className="h-3"></div>')
    .replace(/\n/g, '<br/>');
    
  return { __html: formatted };
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3 mt-auto">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white text-[11px] shadow-sm font-bold">
            AI
          </div>
        </div>
      )}
      <div 
        className={`max-w-[85%] px-5 py-3.5 shadow-sm text-[15px] ${
          isUser 
            ? 'bg-slate-900 text-white rounded-2xl rounded-br-sm' 
            : 'bg-white border border-gray-200 text-gray-700 rounded-2xl rounded-bl-sm leading-relaxed'
        }`}
      >
        <div 
          className={isUser ? '' : 'markdown-content'}
          dangerouslySetInnerHTML={formatMarkdown(message.text)} 
        />
      </div>
    </div>
  );
};

export default MessageBubble;
