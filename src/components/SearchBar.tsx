import React, { useState, useRef, useEffect } from 'react';
import { Search, MessageSquare, ArrowRight } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { Link, useNavigate } from 'react-router-dom';
import { getApiKeyStatus } from '../utils/envCheck';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search for answers, guides, or ask anything...", 
  onSearch,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { results, loading, search } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const apiKeyStatus = getApiKeyStatus();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        search(query);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else if (apiKeyStatus.isConfigured) {
        navigate(`/chat?q=${encodeURIComponent(query)}`);
      } else {
        // Redirect to FAQ if AI is not available
        navigate('/faq');
      }
      setShowResults(false);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
  };

  // Check if Supabase is configured for community features
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Search Results</h3>
              </div>
              {results.map((result) => (
                <Link
                  key={result.id}
                  to={result.url}
                  onClick={handleResultClick}
                  className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-1 rounded ${
                      result.type === 'question' ? 'bg-blue-100 text-blue-600' :
                      result.type === 'faq' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <Search className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {result.content}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.type === 'question' ? 'bg-blue-100 text-blue-700' :
                          result.type === 'faq' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {result.type.toUpperCase()}
                        </span>
                        {result.category && (
                          <span className="text-xs text-gray-500">
                            {result.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </>
          ) : query.trim() ? (
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">No results found for "{query}"</p>
              {!isSupabaseConfigured && (
                <p className="text-xs text-orange-600 mb-2">
                  Community search requires Supabase configuration
                </p>
              )}
              <button
                onClick={() => {
                  if (apiKeyStatus.isConfigured) {
                    navigate(`/chat?q=${encodeURIComponent(query)}`);
                  } else {
                    navigate('/faq');
                  }
                  setShowResults(false);
                }}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{apiKeyStatus.isConfigured ? 'Ask our AI Assistant instead' : 'Check our FAQ section instead'}</span>
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;