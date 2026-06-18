const YOUTUBE_PATTERNS = [
  /[?&]v=([a-zA-Z0-9_-]{11})/,
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/,
];

export interface YouTubeInfo {
  id: string;
  thumbnailUrl: string;
}

export function parseYouTubeUrl(url: string): YouTubeInfo | null {
  if (!url) return null;
  for (const pat of YOUTUBE_PATTERNS) {
    const m = url.match(pat);
    if (m) {
      return {
        id: m[1],
        thumbnailUrl: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`,
      };
    }
  }
  return null;
}
