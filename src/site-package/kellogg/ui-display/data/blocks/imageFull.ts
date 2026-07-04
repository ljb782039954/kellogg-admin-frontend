import type { ImageFullContent } from '../../block-adapters/imageFullAdapter';

export const imageFullProps: ImageFullContent = {
  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&auto=format&fit=crop&q=80",
  alt: { zh: "高品质经典大图海报", en: "Premium Classic Brand Banner" },
  description: { zh: "轻量、清晰、适合视觉海报展示", en: "Clean visual banner for campaign storytelling" },
  height: "medium",
  width: "full",
  overlay: true,
};

export default imageFullProps;
