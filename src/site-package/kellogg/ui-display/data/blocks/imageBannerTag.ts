export interface ImageBannerTagProps {
  image?: string;
  tag?: { zh: string; en: string };
  title?: { zh: string; en: string };
  subtitle?: { zh: string; en: string };
  cta?: { zh: string; en: string };
  link?: { type: string; href: string };
}

export const imageBannerTagProps: ImageBannerTagProps = {
  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80",
  tag: { zh: "本月焦点", en: "Monthly Highlight" },
  title: { zh: "独家奢华科技面料发布", en: "Exclusive Tech Fabric Launch" },
  subtitle: { zh: "具有高弹抗皱、智能透湿的奢华混纺面料已投入大货定制，极速下单尝鲜！", en: "Super-stretch, wrinkle-resistant and breathable luxury blends are now open for bulk orders!" },
  cta: { zh: "获取面料小样", en: "Request Swatches" },
  link: { type: "page", href: "/contact" }
};

export default imageBannerTagProps;
