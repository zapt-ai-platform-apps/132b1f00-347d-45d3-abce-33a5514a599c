import React from 'react';
import useTranslation from '../../hooks/useTranslation';
import useApiConfig from '../../hooks/useApiConfig';
import usePrompt from '../../hooks/usePrompt';
import ApiKeyManager from '../../features/translator/components/ApiKeyManager';
import FileUploader from '../../features/translator/components/FileUploader';
import ProgressBar from '../../features/translator/components/ProgressBar';
import SubtitleDisplay from '../../features/translator/components/SubtitleDisplay';
import TranslationPromptEditor from '../../features/translator/components/TranslationPromptEditor';
import { formatSubtitlesToSRT } from '../../models/Subtitle';

const TranslatorScreen = () => {
  const {
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
  } = useTranslation();

  const { apiConfig } = useApiConfig();
  const { prompt, isPromptValid } = usePrompt();

  const handleTranslate = async () => {
    if (!apiConfig) {
      setError('Please enter a valid API key first');
      return;
    }
    
    if (subtitles.length === 0) {
      setError('Please upload a subtitle file first');
      return;
    }
    
    if (!isPromptValid()) {
      setError('The translation prompt must include {{subtitle}} placeholder');
      return;
    }
    
    await startTranslation(apiConfig, prompt.template);
  };

  const handleSaveTranslation = () => {
    if (subtitles.length === 0 || !subtitles[0].translatedText) {
      setError('No translated subtitles to save');
      return;
    }
    
    console.log('Saving translated subtitles');
    const srtContent = formatSubtitlesToSRT(subtitles, true);
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">English to Persian Subtitle Translator</h1>
      
      <ApiKeyManager />
      
      <FileUploader 
        onSubtitlesLoaded={handleSubtitlesLoaded} 
        disabled={isTranslating}
      />
      
      {subtitles.length > 0 && (
        <>
          <TranslationPromptEditor 
            disabled={isTranslating}
          />
          
          <ProgressBar progress={progress} isTranslating={isTranslating} />
          
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !apiConfig || !isPromptValid()}
              className={`px-4 py-2 rounded-md text-white font-medium cursor-pointer ${
                isTranslating || !apiConfig || !isPromptValid() 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Translate to Persian
            </button>
            
            {isTranslating && (
              <button
                onClick={stopTranslation}
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

export default TranslatorScreen;