import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ThumbsUp, MessageSquare, Clock, User, CheckCircle, Send, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

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
}

interface Answer {
  id: string;
  content: string;
  created_at: string;
  upvotes: number;
  is_best_answer: boolean;
  user_id: string;
  users: {
    name: string;
    role: string;
  };
}

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check if Supabase is configured
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (id) {
      fetchQuestion();
      fetchAnswers();
    }
  }, [id]);

  const fetchQuestion = async () => {
    if (!isSupabaseConfigured) {
      // Show demo question
      setQuestion({
        id: 'demo-1',
        title: 'What is the minimum attendance required at SRM?',
        content: 'I heard it\'s 75% but want to confirm. What happens if you fall below this? Are there any exceptions or ways to get attendance shortage condoned?',
        category: 'attendance',
        created_at: new Date().toISOString(),
        status: 'answered',
        upvotes: 12,
        user_id: 'demo-user',
        users: { name: 'Demo Student', role: 'freshman' }
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          users:user_id (name, role)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setQuestion(data);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    if (!isSupabaseConfigured) {
      // Show demo answers
      setAnswers([
        {
          id: 'demo-answer-1',
          content: 'Yes, the minimum attendance requirement at SRM is 75% for all subjects. If you fall below this, you won\'t be allowed to appear for the end semester exam. However, there are some exceptions:\n\n1. Medical emergencies with proper documentation\n2. Family emergencies with valid proof\n3. Participation in university-sponsored events\n\nYou need to apply for attendance shortage condonation with proper documentation within the specified time frame.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          upvotes: 8,
          is_best_answer: true,
          user_id: 'demo-senior',
          users: { name: 'Senior Helper', role: 'senior' }
        },
        {
          id: 'demo-answer-2',
          content: 'Adding to the previous answer, I\'d recommend keeping track of your attendance regularly through the student portal. Don\'t wait until the last moment to check. If you\'re close to the 75% limit, try to attend all remaining classes.',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          upvotes: 3,
          is_best_answer: false,
          user_id: 'demo-student',
          users: { name: 'Helpful Student', role: 'freshman' }
        }
      ]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('answers')
        .select(`
          *,
          users:user_id (name, role)
        `)
        .eq('question_id', id)
        .order('is_best_answer', { ascending: false })
        .order('upvotes', { ascending: false });

      if (error) throw error;
      setAnswers(data || []);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAnswer.trim()) return;

    if (!isSupabaseConfigured) {
      alert('Community features require database configuration. Please contact the administrator.');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('answers')
        .insert({
          question_id: id,
          user_id: user.id,
          content: newAnswer.trim()
        })
        .select(`
          *,
          users:user_id (name, role)
        `)
        .single();

      if (error) throw error;

      setAnswers(prev => [...prev, data]);
      setNewAnswer('');
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (answerId: string, currentUpvotes: number) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from('answers')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', answerId);

      if (error) throw error;

      setAnswers(prev =>
        prev.map(answer =>
          answer.id === answerId
            ? { ...answer, upvotes: currentUpvotes + 1 }
            : answer
        )
      );
    } catch (error) {
      console.error('Error upvoting answer:', error);
    }
  };

  const markAsBestAnswer = async (answerId: string) => {
    if (!user || !question || question.user_id !== user.id || !isSupabaseConfigured) return;

    try {
      // First, remove best answer status from all answers
      await supabase
        .from('answers')
        .update({ is_best_answer: false })
        .eq('question_id', id);

      // Then mark the selected answer as best
      const { error } = await supabase
        .from('answers')
        .update({ is_best_answer: true })
        .eq('id', answerId);

      if (error) throw error;

      setAnswers(prev =>
        prev.map(answer => ({
          ...answer,
          is_best_answer: answer.id === answerId
        }))
      );
    } catch (error) {
      console.error('Error marking best answer:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h2>
          <Link to="/community" className="text-blue-600 hover:text-blue-700">
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/community"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Community</span>
        </Link>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                question.status === 'answered' ? 'bg-green-100 text-green-800' :
                question.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
              </span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                {question.category}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{question.upvotes}</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
          <p className="text-gray-700 mb-6 whitespace-pre-wrap">{question.content}</p>

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
          </div>
        </motion.div>

        {/* Answers */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          {answers.map((answer, index) => (
            <motion.div
              key={answer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-md p-6 ${
                answer.is_best_answer ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {answer.is_best_answer && (
                <div className="flex items-center space-x-2 mb-4 text-green-600">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">Best Answer</span>
                </div>
              )}

              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{answer.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{answer.users?.name}</span>
                    <span className={`px-1 py-0.5 text-xs rounded ${
                      answer.users?.role === 'senior' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {answer.users?.role}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeAgo(answer.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleUpvote(answer.id, answer.upvotes)}
                    disabled={!user}
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{answer.upvotes}</span>
                  </button>

                  {user && question.user_id === user.id && !answer.is_best_answer && (
                    <button
                      onClick={() => markAsBestAnswer(answer.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Mark as Best</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Answer Form */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here... Be helpful and provide detailed information."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                required
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Help others by providing detailed, accurate answers based on your experience.
                </p>
                <button
                  type="submit"
                  disabled={submitting || !newAnswer.trim()}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    submitting || !newAnswer.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Post Answer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to Answer</h3>
            <p className="text-gray-600 mb-4">
              Join our community to help others by sharing your knowledge and experience.
            </p>
            <button
              onClick={() => {/* This will be handled by the auth modal */}}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;