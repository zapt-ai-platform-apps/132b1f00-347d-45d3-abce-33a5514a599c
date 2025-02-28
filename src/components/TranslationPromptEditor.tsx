import React, { useState, useEffect } from 'react';

interface TranslationPromptEditorProps {
  onPromptChange: (prompt: string) => void;
  disabled: boolean;
}

const TranslationPromptEditor: React.FC<TranslationPromptEditorProps> = ({ 
  onPromptChange, 
  disabled 
}) => {
  const [prompt, setPrompt] = useState<string>(
    `Translate the following English text to Persian. Keep the translation concise and accurate:

"{{subtitle}}"`
  );

  useEffect(() => {
    // Load saved prompt from localStorage if available
    const savedPrompt = localStorage.getItem('translation_prompt');
    if (savedPrompt) {
      setPrompt(savedPrompt);
      onPromptChange(savedPrompt);
    } else {
      // Use the default prompt
      onPromptChange(prompt);
    }
  }, []);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    onPromptChange(newPrompt);
    localStorage.setItem('translation_prompt', newPrompt);
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold mb-3 text-lg">Translation Prompt</h3>
      <p className="text-sm text-gray-600 mb-3">
        Customize the prompt sent to Gemini AI for translation. Use <code>{"{{subtitle}}"}</code> as a placeholder for the subtitle text.
      </p>
      <textarea
        value={prompt}
        onChange={handlePromptChange}
        disabled={disabled}
        className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono min-h-[120px] box-border"
        placeholder="Enter your custom translation prompt..."
      />
      {prompt.includes("{{subtitle}}") ? (
        <p className="text-xs text-green-600 mt-1">
          ✓ Prompt contains the subtitle placeholder
        </p>
      ) : (
        <p className="text-xs text-red-600 mt-1">
          ⚠️ Prompt must include <code>{"{{subtitle}}"}</code> to insert the subtitle text
        </p>
      )}
    </div>
  );
};

export default TranslationPromptEditor;