/**
 * Configuration for the Google Gemini API
 * @typedef {Object} ApiKeyConfig
 * @property {string} key - The API key for Google Gemini
 * @property {string} model - The model to use for translation
 */
export interface ApiKeyConfig {
  key: string;
  model: string;
}

/**
 * Available models for Google Gemini
 */
export const GEMINI_MODELS = [
  "gemini-pro",
  "gemini-pro-vision"
];

/**
 * Creates a new API key configuration
 * @param {string} key - The API key
 * @param {string} model - The model name
 * @returns {ApiKeyConfig} The API key configuration
 */
export function createApiKeyConfig(key: string, model: string): ApiKeyConfig {
  return {
    key,
    model
  };
}

/**
 * Validates if the API key is not empty
 * @param {string} key - The API key to validate
 * @returns {boolean} True if the key is valid
 */
export function validateApiKey(key: string): boolean {
  return key.trim().length > 0;
}