import type { GalleryContent } from '../../components/blocks';

export const galleryProps: GalleryContent = {
  title: {
    zh: "灵感与穿搭画廊",
    en: "Inspiration Gallery"
  },
  subtitle: {
    zh: "在日常中感知潮流细节，为您的穿搭提供全新灵感",
    en: "Sensing trendy details in daily life, bringing fresh styling ideas"
  },
  items: [
    {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
      caption: { zh: "摩登都市风尚", en: "Modern City Vibe" }
    },
    {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
      caption: { zh: "优雅午后阳光", en: "Elegant Afternoon Sunshine" }
    },
    {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
      caption: { zh: "复古经典系列", en: "Retro Classic Collection" }
    },
    {
      src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
      caption: { zh: "街头潮流印记", en: "Street Fashion Stamp" }
    }
  ]
};

export default galleryProps;
