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
  "gemini-flash-2",
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

/**
 * Loads API configuration from local storage
 * @returns {ApiKeyConfig|null} The loaded configuration or null if not found
 */
export function loadApiConfigFromStorage(): ApiKeyConfig | null {
  const savedKey = localStorage.getItem('gemini_api_key');
  const savedModel = localStorage.getItem('gemini_model');
  
  if (savedKey && savedModel && GEMINI_MODELS.includes(savedModel)) {
    return createApiKeyConfig(savedKey, savedModel);
  }
  
  return null;
}

/**
 * Saves API configuration to local storage
 * @param {ApiKeyConfig} config - The configuration to save
 */
export function saveApiConfigToStorage(config: ApiKeyConfig): void {
  localStorage.setItem('gemini_api_key', config.key);
  localStorage.setItem('gemini_model', config.model);
}

/**
 * Clears API configuration from local storage
 */
export function clearApiConfigFromStorage(): void {
  localStorage.removeItem('gemini_api_key');
  localStorage.removeItem('gemini_model');
}