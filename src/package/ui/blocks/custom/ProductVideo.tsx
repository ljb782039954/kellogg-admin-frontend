
import { Play } from 'lucide-react';

interface ProductVideoProps {
  url: string;
}

export default function ProductVideo({ url }: ProductVideoProps) {
  // 解析视频平台
  const getEmbedInfo = (url: string) => {
    try {
      const videoUrl = new URL(url);
      const host = videoUrl.hostname.toLowerCase();
      const path = videoUrl.pathname;
      let videoId = '';
      
      // 1. YouTube
      if (host.includes('youtube.com') || host.includes('youtu.be')) {
        let isShorts = false;
        if (host.includes('youtu.be')) {
          videoId = path.slice(1);
        } else if (path.startsWith('/shorts/')) {
          videoId = path.split('/shorts/')[1].split('/')[0];
          isShorts = true;
        } else {
          videoId = videoUrl.searchParams.get('v') || '';
        }
        return { 
          embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
          platform: 'youtube',
          isVertical: isShorts
        };
      }

      // 2. Facebook
      if (host.includes('facebook.com')) {
        return {
          embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`,
          platform: 'facebook',
          isVertical: false 
        };
      }

      // 3. TikTok (Standard Desktop URL)
      if (host.includes('tiktok.com') && path.includes('/video/')) {
        videoId = path.split('/video/')[1].split('?')[0];
        return {
          embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
          platform: 'tiktok',
          isVertical: true
        };
      }

      // 4. X / Twitter
      if (host.includes('twitter.com') || host.includes('x.com')) {
        return { embedUrl: url, platform: 'x', isVertical: false };
      }

      return { embedUrl: url, platform: 'other', isVertical: false };
    } catch {
      return { embedUrl: url, platform: 'other', isVertical: false };
    }
  };

  const { embedUrl, platform, isVertical } = getEmbedInfo(url);

  // 渲染可嵌入的 Iframe (YouTube, Facebook, TikTok)
  if (['youtube', 'facebook', 'tiktok'].includes(platform)) {
    return (
      <div 
        className={`relative ${isVertical ? 'aspect-[9/16] max-w-[420px] mx-auto' : 'aspect-video'} rounded-[32px] overflow-hidden bg-black shadow-2xl border border-gray-100 transition-all duration-700 ease-in-out`}
      >
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Product Video"
        />
      </div>
    );
  }

  // Generic video tag (if it's a direct mp4 link)
  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return (
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
        <video 
          src={url} 
          controls 
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Fallback: 适配 X (Twitter) 或其他无法直接嵌入的平台
  const platformConfig: Record<string, { label: string; bg: string; icon: string }> = {
    x: { label: 'Watch on X', bg: 'bg-[#000000]', icon: '𝕏' },
    tiktok: { label: 'Watch on TikTok', bg: 'bg-[#000000]', icon: '♪' },
    facebook: { label: 'Watch on Facebook', bg: 'bg-[#1877F2]', icon: 'f' },
    other: { label: 'Watch Video', bg: 'bg-gray-900', icon: '▶' }
  };

  const config = platformConfig[platform] || platformConfig.other;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group relative aspect-video rounded-3xl overflow-hidden ${config.bg} flex flex-col items-center justify-center gap-4 transition-all hover:opacity-90 shadow-2xl`}
    >
      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-all border border-white/20">
        <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white font-bold text-2xl mb-1">{config.icon}</span>
        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{config.label}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </a>
  );
}
