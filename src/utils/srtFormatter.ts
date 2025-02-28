import { Subtitle } from '../models/Subtitle';

/**
 * Formats an array of subtitles into SRT file content
 * @param {Subtitle[]} subtitles - The subtitles to format
 * @param {boolean} useTranslated - Whether to use the translated text (if true) or original text
 * @returns {string} Formatted SRT content
 */
export function formatToSRT(subtitles: Subtitle[], useTranslated: boolean = true): string {
  return subtitles.map(subtitle => {
    const text = useTranslated && subtitle.translatedText ? subtitle.translatedText : subtitle.text;
    
    return `${subtitle.id}
${subtitle.startTime} --> ${subtitle.endTime}
${text}`;
  }).join('\n\n');
}