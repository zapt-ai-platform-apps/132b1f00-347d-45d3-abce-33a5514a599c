/**
 * Model representing a translation prompt
 * @typedef {Object} TranslationPrompt
 * @property {string} template - The prompt template with placeholders
 */
export interface TranslationPrompt {
  template: string;
}

/**
 * Default translation prompt
 */
export const DEFAULT_TRANSLATION_PROMPT = `Translate the following English text to Persian. Keep the translation concise and accurate:

"{{subtitle}}"`;

/**
 * Creates a new translation prompt
 * @param {string} template - The prompt template
 * @returns {TranslationPrompt} The created prompt
 */
export function createTranslationPrompt(template: string = DEFAULT_TRANSLATION_PROMPT): TranslationPrompt {
  return {
    template
  };
}

/**
 * Validates if a translation prompt contains the required placeholder
 * @param {TranslationPrompt} prompt - The prompt to validate
 * @returns {boolean} True if the prompt contains the subtitle placeholder
 */
export function validatePrompt(prompt: TranslationPrompt): boolean {
  return prompt.template.includes("{{subtitle}}");
}

/**
 * Loads a translation prompt from local storage
 * @returns {TranslationPrompt} The loaded prompt or default if not found
 */
export function loadPromptFromStorage(): TranslationPrompt {
  const savedPrompt = localStorage.getItem('translation_prompt');
  return createTranslationPrompt(savedPrompt || DEFAULT_TRANSLATION_PROMPT);
}

/**
 * Saves a translation prompt to local storage
 * @param {TranslationPrompt} prompt - The prompt to save
 */
export function savePromptToStorage(prompt: TranslationPrompt): void {
  localStorage.setItem('translation_prompt', prompt.template);
}