import React, { useState, useEffect } from 'react';
import { ApiKeyConfig, GEMINI_MODELS, validateApiKey } from '../models/ApiKeyConfig';

interface ApiKeyManagerProps {
  onConfigChange: (config: ApiKeyConfig) => void;
}

const ApiKeyManager = ({ onConfigChange }: ApiKeyManagerProps) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>(GEMINI_MODELS[0]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load saved API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    const savedModel = localStorage.getItem('gemini_model');
    
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
    
    if (savedModel && GEMINI_MODELS.includes(savedModel)) {
      setModel(savedModel);
    }
    
    if (savedKey && savedModel) {
      onConfigChange({ key: savedKey, model: savedModel });
    }
  }, [onConfigChange]);

  const handleSaveKey = () => {
    if (!validateApiKey(apiKey)) {
      setError('Please enter a valid API key');
      return;
    }
    
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('gemini_model', model);
    
    onConfigChange({ key: apiKey, model });
    setIsSaved(true);
    setError('');
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('gemini_model');
    setApiKey('');
    setIsSaved(false);
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Google Gemini API Configuration</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          API Key
        </label>
        <div className="flex">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
          />
          {isSaved ? (
            <button
              onClick={handleClearKey}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-md cursor-pointer"
            >
              Clear
            </button>
          ) : (
            <button
              onClick={handleSaveKey}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md cursor-pointer"
            >
              Save
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-red-600 text-sm">{error}</p>}
        {isSaved && <p className="mt-1 text-green-600 text-sm">API key saved!</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
        </label>
        <select
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            if (isSaved) {
              localStorage.setItem('gemini_model', e.target.value);
              onConfigChange({ key: apiKey, model: e.target.value });
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 box-border"
        >
          {GEMINI_MODELS.map((modelOption) => (
            <option key={modelOption} value={modelOption}>
              {modelOption}
            </option>
          ))}
        </select>
        {model === "gemini-flash-2" && (
          <p className="mt-1 text-green-600 text-sm">
            Recommended: Gemini Flash 2 is faster for translations
          </p>
        )}
      </div>
      
      <p className="mt-4 text-sm text-gray-600">
        Don't have an API key? <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Get one here</a>.
      </p>
    </div>
  );
};

export default ApiKeyManager;