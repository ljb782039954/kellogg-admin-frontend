export interface VideoSectionProps {
  title?: { zh: string; en: string };
  subtitle?: { zh: string; en: string };
  videoUrl?: string;
  coverImage?: string;
  autoPlay?: boolean;
}

export const videoSectionProps: VideoSectionProps = {
  title: {
    zh: "品牌时尚概念宣传片",
    en: "Brand Fashion Concept Film"
  },
  subtitle: {
    zh: "通过两分钟的视觉感官体验，带您深入探索我们的设计初衷",
    en: "Deep dive into our design vision through a 2-minute cinematic visual experience"
  },
  videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40179-large.mp4",
  coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80",
  autoPlay: false
};

export default videoSectionProps;
