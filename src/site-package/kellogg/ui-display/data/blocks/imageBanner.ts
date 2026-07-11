import type { ImageBannerContent } from '../../components/blocks';

export const imageBannerProps: ImageBannerContent = {
  image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80",
  title: { zh: "本季限量特惠系列", en: "Limited Special Offers" },
  subtitle: { zh: "高等级羊毛大衣及风衣系列享 30% 折扣，售完即止", en: "30% off high-quality wool coats and trench coats, while stock lasts" },
  buttonText: { zh: "查看限时优惠", en: "Shop Specials" },
  linkUrl: "/sale",
  height: "medium",
  overlay: true,
};

export default imageBannerProps;
