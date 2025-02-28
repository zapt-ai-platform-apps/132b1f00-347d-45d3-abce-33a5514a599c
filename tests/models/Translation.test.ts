import { describe, it, expect, vi } from 'vitest';
import { 
  validateTranslationPrompt, 
  ensureValidPrompt, 
  createTranslationPrompt,
  translateSingleSubtitle
} from '../../src/models/Translation';
import { createSubtitle } from '../../src/models/Subtitle';
import { createApiKeyConfig } from '../../src/models/ApiKeyConfig';

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockImplementation(() => {
          return {
            generateContent: vi.fn().mockResolvedValue({
              response: {
                text: vi.fn().mockReturnValue('ترجمه فارسی')
              }
            })
          };
        })
      };
    })
  };
});

describe('Translation Model', () => {
  describe('validateTranslationPrompt', () => {
    it('should return true if the prompt contains the placeholder', () => {
      const prompt = 'Translate {{subtitle}} to Persian';
      expect(validateTranslationPrompt(prompt)).toBe(true);
    });

    it('should return false if the prompt does not contain the placeholder', () => {
      const prompt = 'Translate this text to Persian';
      expect(validateTranslationPrompt(prompt)).toBe(false);
    });
  });

  describe('ensureValidPrompt', () => {
    it('should return the original prompt if it contains the placeholder', () => {
      const prompt = 'Translate {{subtitle}} to Persian';
      expect(ensureValidPrompt(prompt)).toBe(prompt);
    });

    it('should add the placeholder if the prompt does not contain it', () => {
      const prompt = 'Translate this text to Persian';
      const result = ensureValidPrompt(prompt);
      expect(result).toContain('{{subtitle}}');
      expect(result).toContain(prompt);
    });
  });

  describe('createTranslationPrompt', () => {
    it('should replace the placeholder with the actual subtitle text', () => {
      const prompt = 'Translate {{subtitle}} to Persian';
      const subtitle = 'Hello, world!';
      const result = createTranslationPrompt(prompt, subtitle);
      expect(result).toBe('Translate Hello, world! to Persian');
    });

    it('should add the subtitle if the prompt does not contain the placeholder', () => {
      const prompt = 'Translate this text to Persian';
      const subtitle = 'Hello, world!';
      const result = createTranslationPrompt(prompt, subtitle);
      expect(result).toContain('Hello, world!');
    });
  });

  describe('translateSingleSubtitle', () => {
    it('should translate a subtitle and return it with the translation', async () => {
      const subtitle = createSubtitle(1, '00:00:00,000', '00:00:05,000', 'Hello, world!');
      const apiConfig = createApiKeyConfig('fake-key', 'gemini-pro');
      const promptTemplate = 'Translate {{subtitle}} to Persian';
      
      const result = await translateSingleSubtitle(subtitle, apiConfig, promptTemplate);
      
      expect(result.id).toBe(1);
      expect(result.text).toBe('Hello, world!');
      expect(result.translatedText).toBe('ترجمه فارسی');
    });
  });
});