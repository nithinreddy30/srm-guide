import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MessageSquare, ThumbsUp, Clock, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  status: 'open' | 'answered' | 'closed';
  upvotes: number;
  user_id: string;
  users: {
    name: string;
    role: string;
  };
  answers: {
    id: string;
    is_best_answer: boolean;
  }[];
}

const Community = () => {
  const { user, profile } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Check if Supabase is configured
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'academics', label: 'Academics' },
    { id: 'exams', label: 'Exams' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'hostel', label: 'Hostel Life' },
    { id: 'clubs', label: 'Clubs & Activities' },
    { id: 'placement', label: 'Placements' },
    { id: 'general', label: 'General' }
  ];

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, sortBy]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Show demo data when Supabase is not configured
        setQuestions([
          {
            id: 'demo-1',
            title: 'What is the minimum attendance required at SRM?',
            content: 'I heard it\'s 75% but want to confirm. What happens if you fall below this?',
            category: 'attendance',
            created_at: new Date().toISOString(),
            status: 'answered' as const,
            upvotes: 5,
            user_id: 'demo-user',
            users: { name: 'Demo Student', role: 'freshman' },
            answers: [{ id: 'demo-answer-1', is_best_answer: true }]
          },
          {
            id: 'demo-2',
            title: 'How to calculate GPA in SRM?',
            content: 'Can someone explain the GPA calculation method used at SRM University?',
            category: 'academics',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: 'open' as const,
            upvotes: 3,
            user_id: 'demo-user-2',
            users: { name: 'Another Student', role: 'freshman' },
            answers: []
          }
        ]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('questions')
        .select(`
          *,
          users:user_id (name, role),
          answers (id, is_best_answer)
        `);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'popular') {
        query = query.order('upvotes', { ascending: false });
      } else if (sortBy === 'unanswered') {
        query = query.eq('status', 'open');
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Q&A</h1>
            <p className="text-gray-600">Ask questions, share knowledge, and help fellow students</p>
          </div>
          {user && (
            <Link
              to="/community/ask"
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Ask Question</span>
            </Link>
          )}
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="unanswered">Unanswered</option>
            </select>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to ask a question!'}
              </p>
              {user && (
                <Link
                  to="/community/ask"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ask Question</span>
                </Link>
              )}
            </div>
          ) : (
            filteredQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(question.status)}`}>
                        {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                      </span>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {question.category}
                      </span>
                      {question.answers.some(answer => answer.is_best_answer) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <Link
                      to={`/community/question/${question.id}`}
                      className="block group"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-3">
                        {question.content}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{question.users?.name}</span>
                          <span className={`px-1 py-0.5 text-xs rounded ${
                            question.users?.role === 'senior' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {question.users?.role}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(question.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{question.upvotes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{question.answers.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;