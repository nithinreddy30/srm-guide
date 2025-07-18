import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isConfigured: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 6;
  private retryDelay: number = 2000; // 2 seconds

  constructor() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey && apiKey !== 'your_actual_gemini_api_key_here' && apiKey !== 'your_gemini_api_key_here') {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.isConfigured = true;
      }
    } catch (error) {
      console.warn('Gemini API not configured:', error);
      this.isConfigured = false;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= this.maxRetries) {
        throw error;
      }

      // Check if it's a retryable error
      if (error instanceof Error && 
          (error.message.includes('overloaded') || 
           error.message.includes('503') ||
           error.message.includes('temporarily unavailable'))) {
        
        const delayTime = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        await this.delay(delayTime);
        return this.retryWithBackoff(operation, attempt + 1);
      }

      throw error;
    }
  }

  async generateResponse(userMessage: string): Promise<string> {
    if (!this.isConfigured || !this.model) {
      throw new Error('AI Assistant is currently unavailable. Please check our FAQ section for common questions about SRM University, or contact support for help.');
    }

    try {
      return await this.retryWithBackoff(async () => {
        // Enhanced prompt with SRM-specific context
        const srmContext = `
You are an AI assistant for SRM Guide, specifically designed to help freshers at SRM University (SRM Institute of Science and Technology) navigate college life. 

Key SRM University Information:
- Located in Kattankulathur, Chennai, Tamil Nadu
- Follows semester system with credit-based evaluation
- Minimum 75% attendance required for all courses
- Grading scale: A(10), B(9), C(8), D(7), E(6), F(0)
- Total B.Tech credits required: 160
- Exam pattern: 3 Cycle Tests (30 marks) + Internal Assessment (20 marks) + End Semester Exam (50 marks) = 100 marks
- Pass criteria: Minimum 40% in both internal and end semester, overall 50% to pass
- Cycle tests happen in weeks 4-5, 8-9, and 12-13 of semester
- Hostel facilities available with mess, Wi-Fi, and recreational facilities
- Active placement cell with top companies visiting campus

Please provide accurate, helpful, and specific information about SRM University. If you're unsure about specific details, acknowledge it and suggest contacting the university directly.

User Question: ${userMessage}

Please respond in a friendly, helpful manner as if you're a senior student guiding a fresher.
`;

        const result = await this.model.generateContent(srmContext);
        const response = await result.response;
        return response.text();
      });
    } catch (error) {
      console.error('Error generating response:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error("I'm sorry, but there seems to be an issue with the API configuration. Please check our FAQ section for common questions.");
        }
        if (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('429')) {
          throw new Error("The AI Assistant has exceeded its daily usage quota. Please try again tomorrow or check our FAQ section for common questions about SRM University.");
        }
        if (error.message.includes('overloaded') || error.message.includes('503')) {
          throw new Error("I'm currently experiencing high traffic. Please try again in a moment, or check our FAQ section for common questions.");
        }
      }
      
      throw new Error("I'm sorry, I'm having trouble processing your request right now. Please try again later or browse our FAQ section for common questions about SRM University.");
    }
  }

  async generateBlogContent(topic: string): Promise<string> {
    if (!this.isConfigured || !this.model) {
      return "AI content generation is currently unavailable. Please check back later.";
    }

    try {
      const prompt = `
Write a comprehensive blog post about "${topic}" specifically for SRM University freshers. 
Include practical tips, specific information about SRM, and actionable advice.
Format the response in HTML with proper headings (h2, h3), paragraphs, and lists.
Make it engaging and informative for first-year students.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating blog content:', error);
      return "Unable to generate content at this time. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();