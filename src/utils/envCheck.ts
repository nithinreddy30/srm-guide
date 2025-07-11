export const checkEnvironmentSetup = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('⚠️ Gemini API key not configured. AI features will be limited.');
    return false;
  }
  
  console.log('✅ Gemini API key configured successfully');
  return true;
};

export const getApiKeyStatus = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return {
    isConfigured: apiKey && apiKey !== 'your_gemini_api_key_here',
    isEmpty: !apiKey,
    isDefault: apiKey === 'your_gemini_api_key_here'
  };
};