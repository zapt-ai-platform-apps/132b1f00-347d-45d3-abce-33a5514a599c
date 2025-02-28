import { GoogleGenerativeAI } from '@google/generative-ai';
import { Subtitle } from '../models/Subtitle';
import { ApiKeyConfig } from '../models/ApiKeyConfig';
import * as Sentry from '@sentry/browser';

/**
 * Translates an array of subtitles from English to Persian
 * @param {Subtitle[]} subtitles - The subtitles to translate
 * @param {ApiKeyConfig} apiConfig - The API configuration to use
 * @param {function} onProgress - Callback function to report progress (0-100)
 * @returns {Promise<Subtitle[]>} Promise resolving to the translated subtitles
 */
export async function translateSubtitles(
  subtitles: Subtitle[],
  apiConfig: ApiKeyConfig,
  onProgress: (progress: number) => void
): Promise<Subtitle[]> {
  try {
    const genAI = new GoogleGenerativeAI(apiConfig.key);
    const model = genAI.getGenerativeModel({ model: apiConfig.model });
    
    const translatedSubtitles = [...subtitles];
    const totalSubtitles = subtitles.length;
    
    for (let i = 0; i < totalSubtitles; i++) {
      const subtitle = subtitles[i];
      
      // Prepare prompt for translation
      const prompt = `Translate the following English text to Persian. Keep the translation concise and accurate:\n\n"${subtitle.text}"`;
      
      // Call Gemini API
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text().trim();
      
      // Update subtitle with translation
      translatedSubtitles[i] = {
        ...subtitle,
        translatedText
      };
      
      // Update progress
      onProgress(((i + 1) / totalSubtitles) * 100);
    }
    
    return translatedSubtitles;
  } catch (error) {
    console.error('Translation error:', error);
    Sentry.captureException(error);
    throw error;
  }
}