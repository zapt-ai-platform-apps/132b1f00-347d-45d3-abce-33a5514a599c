import { useState } from 'react';
import { ApiKeyConfig } from '../models/ApiKeyConfig';
import { Subtitle, updateSubtitleAtIndex } from '../models/Subtitle';
import { translateSubtitles } from '../models/Translation';
import * as Sentry from '@sentry/browser';

/**
 * Custom hook for managing subtitle translation
 */
export default function useTranslation() {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  /**
   * Loads subtitles into the state
   * @param {Subtitle[]} loadedSubtitles - The subtitles to load
   */
  const handleSubtitlesLoaded = (loadedSubtitles: Subtitle[]) => {
    setSubtitles(loadedSubtitles);
    setProgress(0);
    setError('');
  };

  /**
   * Updates a subtitle at the specified index
   * @param {number} index - The index of the subtitle to update
   * @param {string} translatedText - The new translated text
   */
  const handleSubtitleChange = (index: number, translatedText: string) => {
    setSubtitles(currentSubtitles => 
      updateSubtitleAtIndex(currentSubtitles, index, translatedText)
    );
  };

  /**
   * Starts the translation process
   * @param {ApiKeyConfig} apiConfig - The API configuration
   * @param {string} promptTemplate - The translation prompt template
   */
  const startTranslation = async (apiConfig: ApiKeyConfig, promptTemplate: string) => {
    if (!apiConfig) {
      setError('Please enter a valid API key first');
      return;
    }
    
    if (subtitles.length === 0) {
      setError('Please upload a subtitle file first');
      return;
    }
    
    if (!promptTemplate.includes("{{subtitle}}")) {
      setError('The translation prompt must include {{subtitle}} placeholder');
      return;
    }
    
    setIsTranslating(true);
    setProgress(0);
    setError('');
    
    try {
      console.log('Starting translation process');
      const translatedSubtitles = await translateSubtitles(
        subtitles,
        apiConfig,
        promptTemplate,
        (progressValue) => setProgress(progressValue)
      );
      
      console.log('Translation completed');
      setSubtitles(translatedSubtitles);
    } catch (error) {
      Sentry.captureException(error);
      setError('Translation failed. Please check your API key and try again.');
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  /**
   * Stops the translation process
   */
  const stopTranslation = () => {
    setIsTranslating(false);
    setError('Translation canceled by user');
    console.log('Translation canceled by user');
  };

  /**
   * Toggles the edit mode
   */
  const toggleEditMode = () => {
    setEditMode(!editMode);
    console.log(`Edit mode ${!editMode ? 'enabled' : 'disabled'}`);
  };

  return {
    subtitles,
    isTranslating,
    progress,
    error,
    editMode,
    handleSubtitlesLoaded,
    handleSubtitleChange,
    startTranslation,
    stopTranslation,
    toggleEditMode,
    setError
  };
}