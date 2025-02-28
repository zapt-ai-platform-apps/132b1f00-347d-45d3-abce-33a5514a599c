import { GoogleGenerativeAI } from '@google/generative-ai';
import { Subtitle } from './Subtitle';
import { ApiKeyConfig } from './ApiKeyConfig';

/**
 * Validates if a translation prompt contains the required placeholder
 * @param {string} promptTemplate - The prompt template to validate
 * @returns {boolean} True if the prompt contains the subtitle placeholder
 */
export function validateTranslationPrompt(promptTemplate: string): boolean {
  return promptTemplate.includes("{{subtitle}}");
}

/**
 * Ensures the prompt template has the subtitle placeholder
 * @param {string} promptTemplate - The prompt template to process
 * @returns {string} A valid prompt template with the subtitle placeholder
 */
export function ensureValidPrompt(promptTemplate: string): string {
  if (!validateTranslationPrompt(promptTemplate)) {
    return `${promptTemplate}\n\n"{{subtitle}}"`;
  }
  return promptTemplate;
}

/**
 * Creates a prompt by replacing placeholders with actual content
 * @param {string} promptTemplate - The prompt template
 * @param {string} subtitleText - The subtitle text to insert
 * @returns {string} The final prompt with substituted values
 */
export function createTranslationPrompt(promptTemplate: string, subtitleText: string): string {
  const validPrompt = ensureValidPrompt(promptTemplate);
  return validPrompt.replace("{{subtitle}}", subtitleText);
}

/**
 * Translates a single subtitle from English to Persian
 * @param {Subtitle} subtitle - The subtitle to translate
 * @param {ApiKeyConfig} apiConfig - The API configuration
 * @param {string} promptTemplate - The translation prompt template
 * @returns {Promise<Subtitle>} The translated subtitle
 */
export async function translateSingleSubtitle(
  subtitle: Subtitle,
  apiConfig: ApiKeyConfig,
  promptTemplate: string
): Promise<Subtitle> {
  const genAI = new GoogleGenerativeAI(apiConfig.key);
  const model = genAI.getGenerativeModel({ model: apiConfig.model });
  
  const prompt = createTranslationPrompt(promptTemplate, subtitle.text);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const translatedText = response.text().trim();
  
  return {
    ...subtitle,
    translatedText
  };
}

/**
 * Translates an array of subtitles from English to Persian
 * @param {Subtitle[]} subtitles - The subtitles to translate
 * @param {ApiKeyConfig} apiConfig - The API configuration
 * @param {string} promptTemplate - The prompt template
 * @param {function} onProgress - Callback for progress updates
 * @returns {Promise<Subtitle[]>} The translated subtitles
 */
export async function translateSubtitles(
  subtitles: Subtitle[],
  apiConfig: ApiKeyConfig,
  promptTemplate: string,
  onProgress: (progress: number) => void
): Promise<Subtitle[]> {
  const translatedSubtitles = [...subtitles];
  const totalSubtitles = subtitles.length;
  
  for (let i = 0; i < totalSubtitles; i++) {
    translatedSubtitles[i] = await translateSingleSubtitle(
      subtitles[i],
      apiConfig,
      promptTemplate
    );
    
    // Update progress
    onProgress(((i + 1) / totalSubtitles) * 100);
  }
  
  return translatedSubtitles;
}