import { useState, useEffect } from 'react';
import { 
  ApiKeyConfig, 
  loadApiConfigFromStorage, 
  saveApiConfigToStorage, 
  clearApiConfigFromStorage,
  validateApiKey
} from '../models/ApiKeyConfig';

/**
 * Custom hook for managing API configuration
 */
export default function useApiConfig() {
  const [apiConfig, setApiConfig] = useState<ApiKeyConfig | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gemini-flash-2');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load saved API config from localStorage on component mount
  useEffect(() => {
    const savedConfig = loadApiConfigFromStorage();
    
    if (savedConfig) {
      setApiKey(savedConfig.key);
      setModel(savedConfig.model);
      setApiConfig(savedConfig);
      setIsSaved(true);
    }
  }, []);

  /**
   * Saves the API configuration
   */
  const saveApiKey = () => {
    if (!validateApiKey(apiKey)) {
      setError('Please enter a valid API key');
      return;
    }
    
    const newConfig = { key: apiKey, model };
    saveApiConfigToStorage(newConfig);
    setApiConfig(newConfig);
    setIsSaved(true);
    setError('');
  };

  /**
   * Clears the API configuration
   */
  const clearApiKey = () => {
    clearApiConfigFromStorage();
    setApiKey('');
    setApiConfig(null);
    setIsSaved(false);
    setError('');
  };

  /**
   * Updates the model selection
   * @param {string} newModel - The new model to use
   */
  const updateModel = (newModel: string) => {
    setModel(newModel);
    if (isSaved && apiKey) {
      const newConfig = { key: apiKey, model: newModel };
      saveApiConfigToStorage(newConfig);
      setApiConfig(newConfig);
    }
  };

  return {
    apiConfig,
    apiKey,
    model,
    isSaved,
    error,
    setApiKey,
    saveApiKey,
    clearApiKey,
    updateModel
  };
}