import React, { useState } from 'react';
import { ApiKeyConfig } from '../models/ApiKeyConfig';
import { Subtitle } from '../models/Subtitle';
import ApiKeyManager from './ApiKeyManager';
import FileUploader from './FileUploader';
import ProgressBar from './ProgressBar';
import SubtitleDisplay from './SubtitleDisplay';
import TranslationPromptEditor from './TranslationPromptEditor';
import { translateSubtitles } from '../utils/translator';
import { formatToSRT } from '../utils/srtFormatter';
import * as Sentry from '@sentry/browser';

const TranslationManager = () => {
  const [apiConfig, setApiConfig] = useState<ApiKeyConfig | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [promptTemplate, setPromptTemplate] = useState<string>('');

  const handleConfigChange = (config: ApiKeyConfig) => {
    console.log('API configuration updated');
    setApiConfig(config);
  };

  const handlePromptChange = (prompt: string) => {
    console.log('Translation prompt updated');
    setPromptTemplate(prompt);
  };

  const handleSubtitlesLoaded = (loadedSubtitles: Subtitle[]) => {
    setSubtitles(loadedSubtitles);
    setProgress(0);
    setError('');
  };

  const handleSubtitleChange = (index: number, translatedText: string) => {
    setSubtitles(currentSubtitles => {
      const updatedSubtitles = [...currentSubtitles];
      updatedSubtitles[index] = {
        ...updatedSubtitles[index],
        translatedText
      };
      return updatedSubtitles;
    });
  };

  const handleTranslate = async () => {
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

  const handleStopTranslation = () => {
    // This is a simple implementation - ideally you'd want to cancel in-flight requests
    setIsTranslating(false);
    setError('Translation canceled by user');
    console.log('Translation canceled by user');
  };

  const handleSaveTranslation = () => {
    if (subtitles.length === 0 || !subtitles[0].translatedText) {
      setError('No translated subtitles to save');
      return;
    }
    
    console.log('Saving translated subtitles');
    const srtContent = formatToSRT(subtitles, true);
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'translated_subtitle.srt';
    
    // Append to the document, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    console.log(`Edit mode ${!editMode ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">English to Persian Subtitle Translator</h1>
      
      <ApiKeyManager onConfigChange={handleConfigChange} />
      
      <FileUploader 
        onSubtitlesLoaded={handleSubtitlesLoaded} 
        disabled={isTranslating}
      />
      
      {subtitles.length > 0 && (
        <>
          <TranslationPromptEditor 
            onPromptChange={handlePromptChange}
            disabled={isTranslating}
          />
          
          <ProgressBar progress={progress} isTranslating={isTranslating} />
          
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !apiConfig || !promptTemplate.includes("{{subtitle}}")}
              className={`px-4 py-2 rounded-md text-white font-medium cursor-pointer ${
                isTranslating || !apiConfig || !promptTemplate.includes("{{subtitle}}") 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Translate to Persian
            </button>
            
            {isTranslating && (
              <button
                onClick={handleStopTranslation}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium cursor-pointer"
              >
                Stop Translation
              </button>
            )}
            
            {subtitles.some(s => s.translatedText) && (
              <>
                <button
                  onClick={toggleEditMode}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer"
                >
                  {editMode ? 'Disable Editing' : 'Enable Editing'}
                </button>
                
                <button
                  onClick={handleSaveTranslation}
                  className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium cursor-pointer"
                >
                  Save Translated Subtitles
                </button>
              </>
            )}
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <SubtitleDisplay
            subtitles={subtitles}
            editMode={editMode}
            onSubtitleChange={handleSubtitleChange}
          />
        </>
      )}
    </div>
  );
};

export default TranslationManager;