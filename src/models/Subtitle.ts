/**
 * Model representing a subtitle entry
 * @typedef {Object} Subtitle
 * @property {number} id - The subtitle sequence number
 * @property {string} startTime - The start time in SRT format (00:00:00,000)
 * @property {string} endTime - The end time in SRT format (00:00:00,000)
 * @property {string} text - The original subtitle text
 * @property {string} [translatedText] - The translated subtitle text (if available)
 */
export interface Subtitle {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
  translatedText?: string;
}

/**
 * Creates a new subtitle entry
 * @param {number} id - The subtitle sequence number
 * @param {string} startTime - The start time
 * @param {string} endTime - The end time
 * @param {string} text - The original subtitle text
 * @param {string} [translatedText] - The translated subtitle text
 * @returns {Subtitle} The created subtitle object
 */
export function createSubtitle(
  id: number,
  startTime: string,
  endTime: string,
  text: string,
  translatedText?: string
): Subtitle {
  return {
    id,
    startTime,
    endTime,
    text,
    translatedText
  };
}

/**
 * Formats an array of subtitles into SRT file content
 * @param {Subtitle[]} subtitles - The subtitles to format
 * @param {boolean} useTranslated - Whether to use the translated text (if true) or original text
 * @returns {string} Formatted SRT content
 */
export function formatSubtitlesToSRT(subtitles: Subtitle[], useTranslated: boolean = true): string {
  return subtitles.map(subtitle => {
    const text = useTranslated && subtitle.translatedText ? subtitle.translatedText : subtitle.text;
    
    return `${subtitle.id}
${subtitle.startTime} --> ${subtitle.endTime}
${text}`;
  }).join('\n\n');
}

/**
 * Parses an SRT file content into an array of Subtitle objects
 * @param {string} content - The content of the SRT file
 * @returns {Subtitle[]} Array of parsed subtitles
 */
export function parseSubtitlesFromSRT(content: string): Subtitle[] {
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

/**
 * Updates a subtitle with new translated text
 * @param {Subtitle} subtitle - The subtitle to update
 * @param {string} translatedText - The new translated text
 * @returns {Subtitle} The updated subtitle
 */
export function updateSubtitleTranslation(subtitle: Subtitle, translatedText: string): Subtitle {
  return {
    ...subtitle,
    translatedText
  };
}

/**
 * Updates a subtitle at the specified index in an array
 * @param {Subtitle[]} subtitles - The array of subtitles
 * @param {number} index - The index of the subtitle to update
 * @param {string} translatedText - The new translated text
 * @returns {Subtitle[]} The updated array of subtitles
 */
export function updateSubtitleAtIndex(
  subtitles: Subtitle[],
  index: number,
  translatedText: string
): Subtitle[] {
  const updatedSubtitles = [...subtitles];
  updatedSubtitles[index] = updateSubtitleTranslation(updatedSubtitles[index], translatedText);
  return updatedSubtitles;
}