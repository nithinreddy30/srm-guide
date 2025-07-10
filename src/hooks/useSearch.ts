import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'question' | 'faq' | 'blog';
  category?: string;
  url: string;
  relevance: number;
}

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setQuery(searchQuery);

    try {
      // Search questions
      const { data: questions } = await supabase
        .from('questions')
        .select('id, title, content, category, created_at')
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .limit(10);

      // Create search results
      const searchResults: SearchResult[] = [];

      // Add questions to results
      if (questions) {
        questions.forEach(question => {
          const titleMatch = question.title.toLowerCase().includes(searchQuery.toLowerCase());
          const contentMatch = question.content.toLowerCase().includes(searchQuery.toLowerCase());
          
          searchResults.push({
            id: question.id,
            title: question.title,
            content: question.content.substring(0, 150) + '...',
            type: 'question',
            category: question.category,
            url: `/community/question/${question.id}`,
            relevance: titleMatch ? 1 : (contentMatch ? 0.7 : 0.5)
          });
        });
      }

      // Add static FAQ results
      const faqResults = searchStaticContent(searchQuery);
      searchResults.push(...faqResults);

      // Sort by relevance
      searchResults.sort((a, b) => b.relevance - a.relevance);

      setResults(searchResults.slice(0, 8));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const searchStaticContent = (searchQuery: string): SearchResult[] => {
    const staticContent = [
      {
        id: 'faq-attendance',
        title: 'Attendance Requirements',
        content: 'Minimum 75% attendance required for all courses...',
        type: 'faq' as const,
        category: 'academics',
        url: '/faq#attendance',
        keywords: ['attendance', '75%', 'minimum', 'requirement']
      },
      {
        id: 'faq-gpa',
        title: 'GPA Calculation',
        content: 'How to calculate your GPA at SRM University...',
        type: 'faq' as const,
        category: 'academics',
        url: '/faq#academics',
        keywords: ['gpa', 'grade', 'calculation', 'points']
      },
      {
        id: 'faq-hostel',
        title: 'Hostel Life',
        content: 'Everything about hostel facilities and rules...',
        type: 'faq' as const,
        category: 'hostel',
        url: '/faq#hostel',
        keywords: ['hostel', 'accommodation', 'mess', 'facilities']
      }
    ];

    return staticContent
      .filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some(keyword => keyword.includes(searchQuery.toLowerCase()))
      )
      .map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        type: item.type,
        category: item.category,
        url: item.url,
        relevance: item.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0.8
      }));
  };

  return {
    results,
    loading,
    query,
    search
  };
};