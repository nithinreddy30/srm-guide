import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkEnvironmentSetup } from './utils/envCheck';

// Check environment setup on app start (non-blocking)
try {
  checkEnvironmentSetup();
} catch (error) {
  console.warn('Environment check failed:', error);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);