import React from 'react';
import { Subtitle } from '../models/Subtitle';

interface SubtitleDisplayProps {
  subtitles: Subtitle[];
  editMode: boolean;
  onSubtitleChange: (index: number, translatedText: string) => void;
}

const SubtitleDisplay = ({ 
  subtitles, 
  editMode, 
  onSubtitleChange 
}: SubtitleDisplayProps) => {
  if (subtitles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <h3 className="font-semibold mb-2 text-lg">Original (English)</h3>
        <div className="border border-gray-300 rounded-md h-80 overflow-y-auto p-4 bg-white">
          {subtitles.map((subtitle, index) => (
            <div key={`original-${subtitle.id}`} className="mb-4 pb-2 border-b border-gray-200 last:border-b-0">
              <div className="text-xs text-gray-500 mb-1">
                {subtitle.startTime} → {subtitle.endTime}
              </div>
              <div className="text-sm">{subtitle.text}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2 text-lg">Translated (Persian)</h3>
        <div className="border border-gray-300 rounded-md h-80 overflow-y-auto p-4 bg-white">
          {subtitles.map((subtitle, index) => (
            <div key={`translated-${subtitle.id}`} className="mb-4 pb-2 border-b border-gray-200 last:border-b-0">
              <div className="text-xs text-gray-500 mb-1">
                {subtitle.startTime} → {subtitle.endTime}
              </div>
              {editMode ? (
                <textarea
                  value={subtitle.translatedText || ''}
                  onChange={(e) => onSubtitleChange(index, e.target.value)}
                  dir="rtl"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm box-border"
                  rows={2}
                />
              ) : (
                <div className="text-sm text-right" dir="rtl">
                  {subtitle.translatedText || ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubtitleDisplay;