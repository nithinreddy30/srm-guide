import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();

  // This would normally fetch the blog post from an API
  const blogPost = {
    title: "Complete Guide to Surviving Your First Year at SRM",
    content: `
      <h2>Welcome to SRM University!</h2>
      <p>Starting your journey at SRM University can be both exciting and overwhelming. This comprehensive guide will help you navigate your first year successfully.</p>
      
      <h3>1. Understanding the Academic System</h3>
      <p>SRM follows a semester-based credit system. Each semester typically lasts 16-18 weeks with regular assessments including:</p>
      <ul>
        <li>Continuous Assessment (CA): 50 marks</li>
        <li>End Semester Exam (ESE): 50 marks</li>
        <li>Minimum 75% attendance required</li>
      </ul>
      
      <h3>2. Managing Your Time Effectively</h3>
      <p>Time management is crucial for academic success. Here are some proven strategies:</p>
      <ul>
        <li>Create a daily schedule and stick to it</li>
        <li>Use the Pomodoro Technique for studying</li>
        <li>Prioritize tasks based on deadlines and importance</li>
        <li>Take regular breaks to avoid burnout</li>
      </ul>
      
      <h3>3. Making the Most of Campus Life</h3>
      <p>University life isn't just about academics. Here's how to make the most of it:</p>
      <ul>
        <li>Join clubs that align with your interests</li>
        <li>Participate in cultural and technical events</li>
        <li>Build meaningful relationships with peers and faculty</li>
        <li>Explore leadership opportunities</li>
      </ul>
      
      <h3>4. Preparing for Examinations</h3>
      <p>Effective exam preparation strategies:</p>
      <ul>
        <li>Start preparation early, don't wait for the last minute</li>
        <li>Create study groups with classmates</li>
        <li>Practice previous year question papers</li>
        <li>Seek help from professors during office hours</li>
      </ul>
      
      <h3>5. Building Professional Skills</h3>
      <p>Start building your professional profile from day one:</p>
      <ul>
        <li>Learn programming languages relevant to your field</li>
        <li>Work on personal projects</li>
        <li>Build a strong LinkedIn profile</li>
        <li>Apply for internships early</li>
      </ul>
      
      <h3>Conclusion</h3>
      <p>Your first year at SRM is a foundation for your entire university experience. Focus on building good habits, maintaining academic excellence, and making meaningful connections. Remember, every successful student started exactly where you are now.</p>
      
      <p>Good luck with your journey at SRM University!</p>
    `,
    author: "SRM Guide Team",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "First Year Guide",
    image: "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=1200"
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Blog
        </Link>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Image */}
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={blogPost.image}
              alt={blogPost.title}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Meta Information */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  {blogPost.category}
                </span>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-sm">{blogPost.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{new Date(blogPost.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{blogPost.readTime}</span>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
            >
              {blogPost.title}
            </motion.h1>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Tags and Share */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Tags:</span>
                  <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                    First Year
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                    SRM University
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded">
                    Study Tips
                  </span>
                </div>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/blog/cycle-test-preparation" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Cycle Test Preparation"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    How to Prepare for Cycle Tests
                  </h4>
                  <p className="text-gray-600 text-sm mt-2">
                    Master the art of cycle test preparation with proven strategies.
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/blog/top-clubs-srm" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Top Clubs at SRM"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Top 10 Clubs at SRM
                  </h4>
                  <p className="text-gray-600 text-sm mt-2">
                    Discover the best clubs that can enhance your college experience.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;