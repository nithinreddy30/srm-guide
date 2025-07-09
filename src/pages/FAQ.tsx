import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, BookOpen, GraduationCap, Home, Users, Briefcase, Calendar } from 'lucide-react';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('academics');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'academics', label: 'Academics', icon: BookOpen },
    { id: 'exams', label: 'Exams & Evaluation', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'hostel', label: 'Hostel & Campus', icon: Home },
    { id: 'clubs', label: 'Clubs & Activities', icon: Users },
    { id: 'placement', label: 'Placement & Training', icon: Briefcase },
  ];

  const faqs = {
    academics: [
      {
        question: "What is the credit system in SRM?",
        answer: "SRM follows a credit-based system where each course has a specific credit value. Typically, a B.Tech degree requires 160 credits to graduate. Theory courses usually have 3-4 credits, while lab courses have 1-2 credits."
      },
      {
        question: "How is the GPA calculated?",
        answer: "GPA is calculated by dividing the total grade points earned by the total credit hours attempted. Grade points are calculated by multiplying the grade value (A=10, B=9, C=8, etc.) by the credit hours for each course."
      },
      {
        question: "What are the different grading scales?",
        answer: "SRM uses a 10-point grading scale: A (10), B (9), C (8), D (7), E (6), F (0). The minimum passing grade is E (6 points)."
      },
      {
        question: "Can I change my branch after admission?",
        answer: "Branch change is possible after the first year based on academic performance and availability of seats. You need to maintain a high GPA and apply during the specified time period."
      },
      {
        question: "What is the course registration process?",
        answer: "Course registration happens at the beginning of each semester through the SRM student portal. You'll need to select courses based on your curriculum and available slots."
      }
    ],
    exams: [
      {
        question: "When do cycle tests happen?",
        answer: "Cycle tests are conducted three times per semester - CT1, CT2, and CT3. They typically happen in weeks 4-5, 8-9, and 12-13 of the semester."
      },
      {
        question: "What is the exam pattern for B.Tech?",
        answer: "The exam pattern includes: 3 Cycle Tests (30 marks total), Internal Assessment (20 marks), and End Semester Exam (50 marks). The total is 100 marks per subject."
      },
      {
        question: "How is internal assessment calculated?",
        answer: "Internal assessment includes assignments, quizzes, lab performance, and class participation. It contributes 20% to your final grade."
      },
      {
        question: "What happens if I miss a cycle test?",
        answer: "If you miss a cycle test due to valid reasons (medical emergency, family emergency), you can apply for a makeup test with proper documentation within 48 hours."
      },
      {
        question: "What is the pass criteria for each subject?",
        answer: "You need to score at least 40% in both internal assessment and end semester exam, with an overall minimum of 50% to pass a subject."
      }
    ],
    attendance: [
      {
        question: "What is the minimum attendance required?",
        answer: "The minimum attendance requirement is 75% for all courses. Students with less than 75% attendance will not be allowed to appear for end semester exams."
      },
      {
        question: "How is attendance calculated?",
        answer: "Attendance is calculated as (Classes Attended / Total Classes Conducted) × 100. This includes both theory and practical classes."
      },
      {
        question: "Can I get attendance shortage relaxation?",
        answer: "Attendance shortage can be condoned in exceptional circumstances like medical emergencies, family emergencies, or participation in university events with proper documentation."
      },
      {
        question: "How often is attendance updated?",
        answer: "Attendance is updated daily and can be viewed through the SRM student portal. Students are advised to check regularly."
      }
    ],
    hostel: [
      {
        question: "What are the hostel rules and regulations?",
        answer: "Hostel rules include: no outside food delivery after 10 PM, visitors allowed only in common areas, mandatory attendance for mess meals, and lights out by 11 PM on weekdays."
      },
      {
        question: "What facilities are available in hostels?",
        answer: "Hostels provide furnished rooms, Wi-Fi, laundry facilities, mess dining, recreation rooms, study halls, and 24/7 security."
      },
      {
        question: "Can I change my hostel room?",
        answer: "Room changes are possible during the room change period at the beginning of each semester, subject to availability and valid reasons."
      },
      {
        question: "What is the hostel fee structure?",
        answer: "Hostel fees vary by room type and facilities. AC rooms cost more than non-AC rooms. Fees typically range from ₹80,000 to ₹1,50,000 per year."
      }
    ],
    clubs: [
      {
        question: "How can I join clubs at SRM?",
        answer: "Club recruitment happens at the beginning of each academic year. You can apply through the club's official channels, attend recruitment drives, and participate in selection processes."
      },
      {
        question: "What are the major clubs and societies?",
        answer: "Major clubs include: Tech clubs (Coding, Robotics, AI/ML), Cultural clubs (Dance, Music, Drama), Sports clubs, Literary clubs, and Social service clubs."
      },
      {
        question: "Can I start my own club?",
        answer: "Yes, you can start your own club with a minimum of 20 members, faculty advisor approval, and administrative clearance. Submit a proposal to the Student Activities Office."
      },
      {
        question: "What are the benefits of joining clubs?",
        answer: "Benefits include skill development, networking opportunities, leadership experience, certificates, and priority consideration for internships and placements."
      }
    ],
    placement: [
      {
        question: "When do placement activities start?",
        answer: "Placement activities typically start in the 7th semester for B.Tech students. Pre-placement talks and training sessions begin even earlier."
      },
      {
        question: "What is the placement process?",
        answer: "The process includes: registration, pre-placement training, aptitude tests, technical interviews, HR interviews, and final selection."
      },
      {
        question: "What companies visit SRM for recruitment?",
        answer: "Top companies like TCS, Infosys, Wipro, Accenture, Amazon, Microsoft, Google, and many startups visit SRM for campus recruitment."
      },
      {
        question: "How can I prepare for placements?",
        answer: "Prepare by: maintaining good academic performance, developing technical skills, practicing coding problems, improving communication skills, and participating in internships."
      }
    ]
  };

  const filteredFAQs = faqs[activeCategory].filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about SRM University academics, campus life, and more.
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{category.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {categories.find(cat => cat.id === activeCategory)?.label}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg"
                    >
                      <button
                        onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedQuestion === index ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {expandedQuestion === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-3 text-gray-700"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;