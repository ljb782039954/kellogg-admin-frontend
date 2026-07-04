import type { CarouselContent } from '../../block-adapters/carouselAdapter';

export const carouselProps: CarouselContent = {
  autoPlay: true,
  interval: 5000,
  items: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80",
      title: { zh: "探索夏季潮流新品", en: "Explore Summer Trends" },
      subtitle: { zh: "全场限时折扣，开启您的时尚之旅", en: "Limited time discount, begin your fashion journey" },
      cta: { zh: "立即选购", en: "Shop Now" },
      link: { id: "products", name: { zh: "绔嬪嵆閫夎喘", en: "Shop Now" }, linkType: "internal", href: "/products" }
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80",
      title: { zh: "高定极简美学", en: "High-end Minimalist Aesthetics" },
      subtitle: { zh: "让经典与细节成为您的日常态度", en: "Make classics and details your daily attitude" },
      cta: { zh: "了解更多", en: "Learn More" },
      link: { id: "about", name: { zh: "浜嗚В鏇村", en: "Learn More" }, linkType: "internal", href: "/about" }
    }
  ]
};

export default carouselProps;
