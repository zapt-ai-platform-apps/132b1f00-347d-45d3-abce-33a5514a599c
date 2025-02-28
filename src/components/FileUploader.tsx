import React, { useRef, useState } from 'react';
import { parseSubtitles } from '../utils/srtParser';
import { Subtitle } from '../models/Subtitle';

interface FileUploaderProps {
  onSubtitlesLoaded: (subtitles: Subtitle[]) => void;
  disabled: boolean;
}

const FileUploader = ({ onSubtitlesLoaded, disabled }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.srt')) {
      setError('Please upload a valid .srt file');
      setFileName('');
      return;
    }

    setFileName(file.name);
    setError('');
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const subtitles = parseSubtitles(content);
        if (subtitles.length === 0) {
          setError('No valid subtitles found in the file');
          return;
        }
        console.log(`Parsed ${subtitles.length} subtitles from file`);
        onSubtitlesLoaded(subtitles);
      } catch (error) {
        setError('Failed to parse the subtitle file');
        console.error('Parse error:', error);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file');
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className={`px-4 py-2 rounded-md text-white font-medium cursor-pointer ${
            disabled 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Upload SRT File
        </button>
        {fileName && (
          <span className="ml-3 text-sm text-gray-600">
            {fileName}
          </span>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".srt"
          className="hidden"
          disabled={disabled}
        />
      </div>
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default FileUploader;