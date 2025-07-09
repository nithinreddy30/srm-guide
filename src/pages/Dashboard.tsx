import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Calendar, Award, Plus, Minus } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('gpa');

  const tabs = [
    { id: 'gpa', label: 'GPA Calculator', icon: Calculator },
    { id: 'attendance', label: 'Attendance Tracker', icon: Calendar },
    { id: 'credit', label: 'Credit Calculator', icon: Award },
  ];

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
            Academic Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your GPA, track attendance, and manage your academic progress with our comprehensive tools.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'gpa' && <GPACalculator />}
          {activeTab === 'attendance' && <AttendanceTracker />}
          {activeTab === 'credit' && <CreditCalculator />}
        </div>
      </div>
    </div>
  );
};

const GPACalculator = () => {
  const [subjects, setSubjects] = useState(
    Array(5).fill(null).map((_, index) => ({
      id: index + 1,
      name: '',
      grade: '',
      credit: ''
    }))
  );
  const [gpa, setGPA] = useState<number | null>(null);

  const gradeToPoints = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'RA': 0
  };

  const availableGrades = ['O', 'A+', 'A', 'B+', 'B', 'C', 'RA'];
  const availableCredits = [5, 4, 3, 2, 1];

  const addSubject = () => {
    const newId = Math.max(...subjects.map(s => s.id)) + 1;
    setSubjects([...subjects, { id: newId, name: '', grade: '', credit: '' }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(subject => subject.id !== id));
    }
  };

  const updateSubject = (id: number, field: string, value: string) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === id ? { ...subject, [field]: value } : subject
    );
    setSubjects(updatedSubjects);
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      if (subject.credit && subject.grade) {
        const credit = parseInt(subject.credit);
        const gradePoint = gradeToPoints[subject.grade as keyof typeof gradeToPoints];
        totalPoints += credit * gradePoint;
        totalCredits += credit;
      }
    });

    if (totalCredits > 0) {
      setGPA(parseFloat((totalPoints / totalCredits).toFixed(2)));
    } else {
      setGPA(null);
    }
  };

  // Auto-calculate GPA when subjects change
  React.useEffect(() => {
    calculateGPA();
  }, [subjects]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">SRM GPA Calculator</h2>
      
      {/* Header Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div className="font-medium text-gray-700">Subject Name</div>
        <div className="font-medium text-gray-700">Grade</div>
        <div className="font-medium text-gray-700">Credit</div>
        <div className="font-medium text-gray-700">Grade Points</div>
        <div className="font-medium text-gray-700">Action</div>
      </div>

      <div className="space-y-4">
        {subjects.map((subject) => {
          const gradePoint = subject.grade ? gradeToPoints[subject.grade as keyof typeof gradeToPoints] : 0;
          const credit = subject.credit ? parseInt(subject.credit) : 0;
          const totalPoints = gradePoint * credit;

          return (
            <div key={subject.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Subject Name"
                value={subject.name}
                onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={subject.grade}
                onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Grade</option>
                {availableGrades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade} ({gradeToPoints[grade as keyof typeof gradeToPoints]})
                  </option>
                ))}
              </select>
              <select
                value={subject.credit}
                onChange={(e) => updateSubject(subject.id, 'credit', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Credit</option>
                {availableCredits.map(credit => (
                  <option key={credit} value={credit.toString()}>
                    {credit}
                  </option>
                ))}
              </select>
              <div className="text-center font-medium text-gray-700">
                {subject.grade && subject.credit ? totalPoints : '-'}
              </div>
              <button
                onClick={() => removeSubject(subject.id)}
                disabled={subjects.length <= 1}
                className={`p-2 rounded-md transition-colors ${
                  subjects.length <= 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={addSubject}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Subject</span>
        </button>
        
        <div className="text-sm text-gray-600">
          Total Subjects: {subjects.length}
        </div>
      </div>

      {/* GPA Result */}
      {gpa !== null && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              🎓 Your GPA is: {gpa.toFixed(2)}
            </h3>
            <div className="text-sm text-gray-600">
              {(() => {
                const totalCredits = subjects.reduce((sum, subject) => 
                  subject.credit ? sum + parseInt(subject.credit) : sum, 0
                );
                const totalPoints = subjects.reduce((sum, subject) => {
                  if (subject.grade && subject.credit) {
                    const gradePoint = gradeToPoints[subject.grade as keyof typeof gradeToPoints];
                    return sum + (gradePoint * parseInt(subject.credit));
                  }
                  return sum;
                }, 0);
                return `Total Grade Points: ${totalPoints} | Total Credits: ${totalCredits}`;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Grade Scale Reference */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">SRM Grading Scale</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {Object.entries(gradeToPoints).map(([grade, points]) => (
            <div key={grade} className="flex justify-between bg-white px-2 py-1 rounded">
              <span className="font-medium">{grade}:</span>
              <span>{points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">How to Use</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Enter subject name, select grade and credit for each subject</li>
          <li>• GPA is calculated automatically as you input data</li>
          <li>• Use "Add Subject" to add more subjects</li>
          <li>• GPA = Σ(Grade Points × Credits) ÷ Σ(Credits)</li>
        </ul>
      </div>
    </motion.div>
  );
};

const AttendanceTracker = () => {
  const [subjects, setSubjects] = useState([
    { name: '', attended: '', total: '' }
  ]);

  const addSubject = () => {
    setSubjects([...subjects, { name: '', attended: '', total: '' }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: string, value: string) => {
    const updatedSubjects = subjects.map((subject, i) =>
      i === index ? { ...subject, [field]: value } : subject
    );
    setSubjects(updatedSubjects);
  };

  const calculateAttendance = (attended: string, total: string) => {
    if (!attended || !total) return 0;
    return (parseFloat(attended) / parseFloat(total)) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Attendance Tracker</h2>
      
      <div className="space-y-4">
        {subjects.map((subject, index) => {
          const attendance = calculateAttendance(subject.attended, subject.total);
          return (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <input
                type="text"
                placeholder="Subject Name"
                value={subject.name}
                onChange={(e) => updateSubject(index, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Classes Attended"
                value={subject.attended}
                onChange={(e) => updateSubject(index, 'attended', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Total Classes"
                value={subject.total}
                onChange={(e) => updateSubject(index, 'total', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className={`text-center font-semibold ${
                attendance >= 75 ? 'text-green-600' : 'text-red-600'
              }`}>
                {attendance.toFixed(1)}%
              </div>
              <button
                onClick={() => removeSubject(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={addSubject}
        className="mt-6 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span>Add Subject</span>
      </button>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Attendance Requirements</h3>
        <p className="text-yellow-700">
          • Minimum 75% attendance is required for all subjects<br/>
          • Students with less than 75% attendance cannot appear for end semester exams<br/>
          • Medical certificates can help with attendance shortage in exceptional cases
        </p>
      </div>
    </motion.div>
  );
};

const CreditCalculator = () => {
  const [completedCredits, setCompletedCredits] = useState('');
  const [totalCredits] = useState(160); // Standard B.Tech requirement

  const progress = completedCredits ? (parseFloat(completedCredits) / totalCredits) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Credit Calculator</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Completed Credits
          </label>
            <input
              type="number"
            value={completedCredits}
            onChange={(e) => setCompletedCredits(e.target.value)}
            placeholder="Enter completed credits"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Progress Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Completed Credits:</span>
              <span className="font-semibold">{completedCredits || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Required Credits:</span>
              <span className="font-semibold">{totalCredits}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Credits:</span>
              <span className="font-semibold">{totalCredits - (parseFloat(completedCredits) || 0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-600">
              {progress.toFixed(1)}% Complete
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Credit System Info</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Theory courses: 3-4 credits each</li>
            <li>• Laboratory courses: 1-2 credits each</li>
            <li>• Project courses: 2-6 credits each</li>
            <li>• Total B.Tech requirement: 160 credits</li>
            <li>• Typical semester load: 20-25 credits</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;