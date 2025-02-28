import { describe, it, expect } from 'vitest';
import { 
  createSubtitle, 
  updateSubtitleTranslation, 
  updateSubtitleAtIndex,
  formatSubtitlesToSRT,
  parseSubtitlesFromSRT
} from '../../src/models/Subtitle';

describe('Subtitle Model', () => {
  describe('createSubtitle', () => {
    it('should create a subtitle with the correct properties', () => {
      const subtitle = createSubtitle(1, '00:00:00,000', '00:00:05,000', 'Hello, world!');
      
      expect(subtitle.id).toBe(1);
      expect(subtitle.startTime).toBe('00:00:00,000');
      expect(subtitle.endTime).toBe('00:00:05,000');
      expect(subtitle.text).toBe('Hello, world!');
      expect(subtitle.translatedText).toBeUndefined();
    });

    it('should include translatedText if provided', () => {
      const subtitle = createSubtitle(1, '00:00:00,000', '00:00:05,000', 'Hello, world!', 'سلام دنیا!');
      
      expect(subtitle.translatedText).toBe('سلام دنیا!');
    });
  });

  describe('updateSubtitleTranslation', () => {
    it('should update the translatedText property without modifying other properties', () => {
      const subtitle = createSubtitle(1, '00:00:00,000', '00:00:05,000', 'Hello, world!');
      const updated = updateSubtitleTranslation(subtitle, 'سلام دنیا!');
      
      expect(updated.id).toBe(1);
      expect(updated.startTime).toBe('00:00:00,000');
      expect(updated.endTime).toBe('00:00:05,000');
      expect(updated.text).toBe('Hello, world!');
      expect(updated.translatedText).toBe('سلام دنیا!');
    });
  });

  describe('updateSubtitleAtIndex', () => {
    it('should update the subtitle at the specified index', () => {
      const subtitles = [
        createSubtitle(1, '00:00:00,000', '00:00:05,000', 'Hello, world!'),
        createSubtitle(2, '00:00:05,100', '00:00:10,000', 'How are you?')
      ];
      
      const updated = updateSubtitleAtIndex(subtitles, 1, 'چطوری؟');
      
      expect(updated[0].translatedText).toBeUndefined();
      expect(updated[1].translatedText).toBe('چطوری؟');
    });
  });

  describe('formatSubtitlesToSRT', () => {
    it('should format subtitles to valid SRT content with translated text', () => {
      const subtitles = [
        createSubtitle(1, '00:00:00,000', '00:00:05,000', 'Hello, world!', 'سلام دنیا!'),
        createSubtitle(2, '00:00:05,100', '00:00:10,000', 'How are you?', 'چطوری؟')
      ];
      
      const srt = formatSubtitlesToSRT(subtitles, true);
      
      expect(srt).toContain('1\n00:00:00,000 --> 00:00:05,000\nسلام دنیا!');
      expect(srt).toContain('2\n00:00:05,100 --> 00:00:10,000\nچطوری؟');
    });

    it('should use original text when translatedText is not available', () => {
      const subtitles = [
        createSubtitle(1, '00:00:00,000', '00:00:05,000', 'Hello, world!'),
        createSubtitle(2, '00:00:05,100', '00:00:10,000', 'How are you?')
      ];
      
      const srt = formatSubtitlesToSRT(subtitles, true);
      
      expect(srt).toContain('1\n00:00:00,000 --> 00:00:05,000\nHello, world!');
      expect(srt).toContain('2\n00:00:05,100 --> 00:00:10,000\nHow are you?');
    });
  });

  describe('parseSubtitlesFromSRT', () => {
    it('should parse valid SRT content into subtitle objects', () => {
      const srtContent = `1
00:00:00,000 --> 00:00:05,000
Hello, world!

2
00:00:05,100 --> 00:00:10,000
How are you?`;
      
      const subtitles = parseSubtitlesFromSRT(srtContent);
      
      expect(subtitles.length).toBe(2);
      expect(subtitles[0].id).toBe(1);
      expect(subtitles[0].startTime).toBe('00:00:00,000');
      expect(subtitles[0].endTime).toBe('00:00:05,000');
      expect(subtitles[0].text).toBe('Hello, world!');
      expect(subtitles[1].id).toBe(2);
      expect(subtitles[1].text).toBe('How are you?');
    });
  });
});