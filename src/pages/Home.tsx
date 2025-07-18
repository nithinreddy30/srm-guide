import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle, Calculator, BookOpen, Users, Award, Clock } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { getApiKeyStatus } from '../utils/envCheck';

const Home = () => {
  const apiKeyStatus = getApiKeyStatus();

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'Get instant answers to your college-related queries with our AI-powered chatbot.',
      link: '/chat',
    },
    {
      icon: HelpCircle,
      title: 'FAQ Section',
      description: 'Find answers to frequently asked questions about academics, exams, and campus life.',
      link: '/faq',
    },
    {
      icon: Calculator,
      title: 'GPA Calculator',
      description: 'Calculate your GPA, track attendance, and manage your academic progress.',
      link: '/dashboard',
    },
    {
      icon: BookOpen,
      title: 'Study Guides',
      description: 'Access comprehensive guides and tips for succeeding in your first year.',
      link: '/blog',
    },
  ];

  const stats = [
    { icon: Users, value: '5000+', label: 'Students Helped' },
    { icon: HelpCircle, value: '1000+', label: 'Questions Answered' },
    { icon: Award, value: '95%', label: 'Success Rate' },
    { icon: Clock, value: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-400">SRM Guide</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your comprehensive guide to navigating SRM University. Get instant answers to all your college-related questions.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar 
                placeholder="Ask anything about SRM... (e.g., 'What is the pass criteria?')"
                className="text-gray-900"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {apiKeyStatus.isConfigured ? (
                <Link
                  to="/chat"
                  className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Ask AI Assistant
                </Link>
              ) : (
                <Link
                  to="/faq"
                  className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Browse FAQ
                </Link>
              )}
              <Link
                to="/faq"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                View FAQs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From academic guidance to campus life tips, we've got you covered with all the tools and information you need.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <Link to={feature.link} className="group">
                    <div className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors">
                      <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <Icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your SRM Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students who have successfully navigated their college life with SRM Guide.
            </p>
            {apiKeyStatus.isConfigured ? (
              <Link
                to="/chat"
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors"
              >
                Get Started Now
              </Link>
            ) : (
              <Link
                to="/faq"
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors"
              >
                Explore FAQ
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;