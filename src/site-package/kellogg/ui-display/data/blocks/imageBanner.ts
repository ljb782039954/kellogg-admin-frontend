export interface ImageBannerProps {
  image?: string;
  title?: { zh: string; en: string };
  subtitle?: { zh: string; en: string };
  cta?: { zh: string; en: string };
  link?: { type: string; href: string };
  height?: 'small' | 'medium' | 'large';
}

export const imageBannerProps: ImageBannerProps = {
  image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80",
  title: { zh: "本季限量特惠系列", en: "Limited Special Offers" },
  subtitle: { zh: "高等级羊毛大衣及风衣系列享 30% 折扣，售完即止", en: "30% off high-quality wool coats and trench coats, while stock lasts" },
  cta: { zh: "查看限时优惠", en: "Shop Specials" },
  link: { type: "page", href: "/sale" },
  height: "medium"
};

export default imageBannerProps;
