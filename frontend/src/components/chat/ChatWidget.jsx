import React, { useState } from 'react';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import { sendChatMessage } from '../../services/chatApi';
import './chat.css';

const WELCOME_MESSAGE = `Hi 👋 I'm BAVH AI Assistant.

I can help you:
• Find cars within your budget
• Compare vehicles
• Suggest family cars
• Recommend EVs
• Explain specifications`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: WELCOME_MESSAGE,
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [badgeCount, setBadgeCount] = useState(1); // 1 unread welcome message by default

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setBadgeCount(0);
  };

  const processChatRequest = async (userText) => {
    if (!userText.trim()) return;

    // Add user message to UI
    const newMessages = [...messages, { role: 'user', text: userText.trim(), type: 'text' }];
    setMessages(newMessages);
    setIsLoading(true);

    // Build chat history for conversational memory
    const history = newMessages
      .filter(m => m.type === 'text')
      .slice(0, -1) // Exclude current message
      .map(m => ({ role: m.role, text: m.text }));

    try {
      const response = await sendChatMessage({ message: userText.trim(), history });
      
      let assistantMessages = [];

      // 1. Add Recommendation Cards if they exist
      if (response.recommendations && response.recommendations.length > 0) {
        assistantMessages.push({
          role: 'assistant',
          cards: response.recommendations,
          type: 'cards'
        });
      }

      // 2. Add the AI Explanation as a text message
      if (response.aiExplanation) {
        assistantMessages.push({
          role: 'assistant',
          text: response.aiExplanation,
          type: 'text'
        });
      }

      setMessages([...newMessages, ...assistantMessages]);
      
      if (!isOpen) {
        setBadgeCount(prev => prev + 1);
      }

    } catch (error) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        text: 'Sorry, I am having trouble connecting to the server right now. Please try again later.', 
        type: 'text' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentInput = input;
    setInput('');
    processChatRequest(currentInput);
  };

  const handleChipClick = (chipText) => {
    processChatRequest(chipText);
  };

  return (
    <>
      <ChatButton isOpen={isOpen} toggleOpen={toggleOpen} badgeCount={badgeCount} />
      <ChatWindow 
        isOpen={isOpen} 
        closeChat={() => setIsOpen(false)}
        messages={messages}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        handleChipClick={handleChipClick}
      />
    </>
  );
};

export default ChatWidget;
