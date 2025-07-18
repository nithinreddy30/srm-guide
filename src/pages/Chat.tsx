import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Lightbulb, Loader } from 'lucide-react';
import { useGemini, Message } from '../hooks/useGemini';
import { getApiKeyStatus } from '../utils/envCheck';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your SRM Guide AI Assistant. I'm here to help you with any questions about SRM University. Ask me about academics, exams, attendance, hostel life, or anything else related to college life at SRM!",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading, error } = useGemini();
  const apiKeyStatus = getApiKeyStatus();

  const sampleQuestions = [
    "What is the minimum attendance required at SRM?",
    "How is the GPA calculated in SRM?",
    "When do cycle tests happen?",
    "What are the hostel rules and facilities?",
    "How do I join clubs at SRM?",
    "What is the exam pattern for B.Tech?",
    "How to prepare for placements at SRM?",
    "What is the credit system in SRM?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const messageToSend = inputMessage;
    setInputMessage('');
    await sendMessage(messageToSend, messages, setMessages);
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">SRM Guide AI Assistant</h1>
                <p className="text-blue-100">Ask me anything about SRM University</p>
              </div>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900">Try asking:</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  disabled={isLoading}
                  className="text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  "{question}"
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {message.sender === 'bot' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-75">{message.timestamp}</span>
                    {message.isLoading && (
                      <Loader className="h-3 w-3 animate-spin" />
                    )}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">
                    {message.isLoading ? (
                      <div className="flex items-center space-x-1">
                        <div className="animate-pulse">Thinking</div>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    ) : (
                      message.text
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t">
            {!apiKeyStatus.isConfigured && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-yellow-800 font-medium mb-1">AI Assistant Unavailable</p>
                    <p className="text-sm text-yellow-700">
                      The AI Assistant is not configured in this deployment. Please check our 
                      <a href="/faq" className="underline hover:text-yellow-900 mx-1">FAQ section</a>
                      for answers to common questions about SRM University.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Service Notice</p>
                    <p className="text-sm text-blue-700 mt-1">
                      AI Assistant is temporarily unavailable. Please check our 
                      <a href="/faq" className="underline hover:text-blue-900 mx-1">FAQ section</a>
                      for comprehensive answers about SRM University.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your question about SRM..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={1}
                disabled={isLoading || !apiKeyStatus.isConfigured}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || !apiKeyStatus.isConfigured}
                className={`px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                  !apiKeyStatus.isConfigured 
                    ? 'bg-gray-400 text-gray-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span className="hidden sm:inline">
                  {!apiKeyStatus.isConfigured ? 'Unavailable' : 'Send'}
                </span>
              </button>
            </div>
            {!apiKeyStatus.isConfigured && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Try our <a href="/faq" className="text-blue-600 hover:underline">FAQ section</a> or 
                <a href="/contact" className="text-blue-600 hover:underline ml-1">contact us</a> for help
              </p>
            )}
          </div>
        </motion.div>

      
      </div>
    </div>
  );
};

export default Chat;