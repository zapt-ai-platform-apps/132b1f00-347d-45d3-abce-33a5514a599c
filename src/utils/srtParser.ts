import { Subtitle, createSubtitle } from '../models/Subtitle';

/**
 * Parses an SRT file content into an array of Subtitle objects
 * @param {string} content - The content of the SRT file
 * @returns {Subtitle[]} Array of parsed subtitles
 */
export function parseSubtitles(content: string): Subtitle[] {
  const blocks = content.trim().split(/\r?\n\r?\n/);
  const subtitles: Subtitle[] = [];

  blocks.forEach(block => {
    const lines = block.split(/\r?\n/);
    if (lines.length >= 3) {
      // Parse subtitle id
      const id = parseInt(lines[0], 10);
      
      // Parse timestamp line
      const timestampLine = lines[1];
      const timestampMatch = timestampLine.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
      
      if (timestampMatch) {
        const startTime = timestampMatch[1];
        const endTime = timestampMatch[2];
        
        // Combine all remaining lines as the text
        const text = lines.slice(2).join('\n');
        
        subtitles.push(createSubtitle(id, startTime, endTime, text));
      }
    }
  });

  return subtitles;
}