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