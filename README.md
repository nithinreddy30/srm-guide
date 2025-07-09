# SRM Guide - AI-Powered University Assistant

A comprehensive web application designed to help freshers navigate SRM University with AI-powered assistance, calculators, FAQs, and helpful guides.

## Features

- **AI Assistant**: Powered by Google's Gemini API for real-time query resolution
- **Comprehensive FAQ**: Categorized questions covering academics, exams, hostel life, and more
- **Academic Tools**: GPA calculator, attendance tracker, and credit calculator
- **Blog Section**: Helpful guides and tips for college life
- **Responsive Design**: Optimized for all devices

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Gemini API
1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the root directory
3. Add your API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run the Application
```bash
npm run dev
```

## API Integration

The application uses Google's Gemini Pro model with SRM-specific context to provide accurate information about:
- Academic policies and procedures
- Exam patterns and evaluation methods
- Attendance requirements
- Hostel facilities and rules
- Club activities and placements
- General campus life guidance

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── services/           # API integration services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── main.tsx           # Application entry point
```

## Environment Variables

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: Google Generative AI (Gemini Pro)
- **Build Tool**: Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.