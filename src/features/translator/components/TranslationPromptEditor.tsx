import React from 'react';
import usePrompt from '../../../hooks/usePrompt';

interface TranslationPromptEditorProps {
  disabled: boolean;
}

const TranslationPromptEditor = ({ disabled }: TranslationPromptEditorProps) => {
  const { prompt, updatePrompt, isPromptValid } = usePrompt();

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePrompt(e.target.value);
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold mb-3 text-lg">Translation Prompt</h3>
      <p className="text-sm text-gray-600 mb-3">
        Customize the prompt sent to Gemini AI for translation. Use <code>{"{{subtitle}}"}</code> as a placeholder for the subtitle text.
      </p>
      <textarea
        value={prompt.template}
        onChange={handlePromptChange}
        disabled={disabled}
        className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono min-h-[120px] box-border"
        placeholder="Enter your custom translation prompt..."
      />
      {isPromptValid() ? (
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