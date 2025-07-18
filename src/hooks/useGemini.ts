import { useState } from 'react';
import { geminiService } from '../services/geminiService';

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isLoading?: boolean;
}

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const sendMessage = async (
    message: string,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    // Add loading bot message
    const loadingMessage: Message = {
      id: messages.length + 2,
      text: 'Thinking...',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);
    setError(null);
    setRetryCount(0);

    try {
      const response = await geminiService.generateResponse(message);
      
      if (!response || response.trim() === '') {
        throw new Error('Empty response from AI service');
      }
      
      // Replace loading message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, text: response, isLoading: false }
            : msg
        )
      );
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error sending message:', err);
      
      let errorMessage: string;
      
      if (err instanceof Error) {
        if (err.message.includes('AI Assistant is currently unavailable')) {
          errorMessage = "I'm sorry, but the AI Assistant is currently unavailable. To enable the AI Assistant:\n\n1. Get your free Gemini API key from: https://makersuite.google.com/app/apikey\n2. Create a .env file in your project root\n3. Add: VITE_GEMINI_API_KEY=your_actual_api_key\n4. Restart the development server\n\nMeanwhile, please check our comprehensive FAQ section for answers to common questions about SRM University.";
        } else {
          errorMessage = err.message;
        }
      } else {
        errorMessage = 'Sorry, I encountered an error. Please try again or check our FAQ section.';
      }
      
      // Set error state for UI feedback
      setError(errorMessage);
      
      // Replace loading message with error message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { 
                ...msg, 
                text: errorMessage, 
                isLoading: false 
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
    retryCount,
  };
};