import { useState, useEffect } from 'react';
import { 
  TranslationPrompt, 
  loadPromptFromStorage, 
  savePromptToStorage,
  validatePrompt,
  DEFAULT_TRANSLATION_PROMPT
} from '../models/TranslationPrompt';

/**
 * Custom hook for managing translation prompts
 */
export default function usePrompt() {
  const [prompt, setPrompt] = useState<TranslationPrompt>({ 
    template: DEFAULT_TRANSLATION_PROMPT 
  });

  // Load saved prompt from localStorage on component mount
  useEffect(() => {
    const savedPrompt = loadPromptFromStorage();
    setPrompt(savedPrompt);
  }, []);

  /**
   * Updates the prompt template
   * @param {string} template - The new prompt template
   */
  const updatePrompt = (template: string) => {
    const newPrompt = { template };
    setPrompt(newPrompt);
    savePromptToStorage(newPrompt);
  };

  /**
   * Checks if the current prompt is valid
   * @returns {boolean} True if the prompt is valid
   */
  const isPromptValid = () => {
    return validatePrompt(prompt);
  };

  return {
    prompt,
    updatePrompt,
    isPromptValid
  };
}