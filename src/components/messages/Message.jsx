import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Info, Speaker, Speech, Volume, Volume2 } from 'lucide-react';
import Tippy from '@tippyjs/react';
import axios from 'axios';
import BotModal from './BotModal';
import Loader from '../loading/Loader'

const Message = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your PayPulse Pro assistant. I can help you with information regarding your shifts for this month. How can I assist you today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
  
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date().toLocaleTimeString()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ask-chatbot`, { question: userMessage.text }, { withCredentials: true });
  
      const botResponse = {
        id: Date.now() + 1,
        text: response.data.answer || "Sorry, I couldn't get a response.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString()
      };
  
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Error: ${error.message}`,
        isBot: true,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  

  const handleSpeech = (text) => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }
  
    window.speechSynthesis.cancel(); // Cancel any ongoing speech before starting new one
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 1;
    utterance.pitch = 1;
  
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (<Loader />)
  }
  

  return (
    <div>
      <BotModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className='flex mb-4 items-end justify-end'>
        <Tippy content='Learn more about PayPulse Bot'>
          <div onClick={() => setIsOpen(true)} className='border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer'>
            <Info className='text-gray-500 hover:text-gray-700 transition-colors' />
          </div>
        </Tippy>
      </div>
      <div className="pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="group relative bg-white rounded-lg border border-gray-200 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {message.isBot ? (
                      <div className="p-2 bg-blue-100 rounded-xl flex-shrink-0">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {message.isBot ? 'PayPulse Assistant' : 'You'}
                        </span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{message.text}</p>
                      {message.isBot && (
                        <div className='absolute bottom-1 right-1 p-1'>
                          <Volume2 onClick={() => handleSpeech(message.text)} className='text-gray-500 h-5 w-5 hover:text-black transition-colors cursor-pointer' />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="group relative bg-white rounded-2xl border border-gray-200 transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-xl flex-shrink-0">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">PayPulse Assistant</span>
                        <span className="text-xs text-gray-500">typing...</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 z-30 left-0 lg:left-70 right-0 bg-white backdrop-blur-lg border-t border-gray-200 shadow-lg p-1">
        <div className="px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isTyping}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about your payments, shifts, or account..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="1"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
