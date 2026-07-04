import type { BrandValuesContent } from '../../block-adapters/brandValuesAdapter';

export const brandValuesProps: BrandValuesContent = {
  title: {
    zh: "品牌价值",
    en: "Brand Values"
  },
  subtitle: {
    zh: "我们的承诺与信念，为您提供最好的服务",
    en: "Our commitment and beliefs, serving you with the best"
  },
  items: [
    {
      id: 1,
      icon: "ShieldCheck",
      title: { zh: "品质保证", "en": "Quality Guarantee" },
      description: { zh: "所有商品均经过严格的质量检验", "en": "All products undergo strict quality testing" }
    },
    {
      id: 2,
      icon: "Truck",
      title: { zh: "全球配送", "en": "Global Shipping" },
      description: { zh: "极速高效物流，支持全球配送", "en": "Fast and efficient logistics worldwide" }
    },
    {
      id: 3,
      icon: "Clock",
      title: { zh: "全天候支持", "en": "24/7 Support" },
      description: { zh: "专业客服团队随时为您解答疑问", "en": "Our professional support team is always ready" }
    }
  ]
};

export default brandValuesProps;
