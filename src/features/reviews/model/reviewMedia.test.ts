import { describe, expect, it } from 'vitest';
import { parseYouTubeUrl } from './reviewMedia';

const id = 'abcdefghijk';

describe('parseYouTubeUrl', () => {
  it.each([
    `https://www.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}`,
    `https://www.youtube.com/embed/${id}`,
    `https://www.youtube.com/shorts/${id}`,
    `https://www.youtube-nocookie.com/embed/${id}`,
  ])('parses supported URL %s', (url) => {
    expect(parseYouTubeUrl(url)).toEqual({
      id,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    });
  });

  it.each([
    '',
    'https://vimeo.com/123',
    'https://youtube.com/watch?v=short',
    'plain text',
  ])('returns null for invalid URL %s', (url) => {
    expect(parseYouTubeUrl(url)).toBeNull();
  });
});
