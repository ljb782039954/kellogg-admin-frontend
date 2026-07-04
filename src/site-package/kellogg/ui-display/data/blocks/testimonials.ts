import type { TestimonialsContent } from '../../block-adapters/testimonialsAdapter';

export const testimonialsProps: TestimonialsContent = {
  title: {
    zh: "真实客户见证",
    en: "Testimonials"
  },
  subtitle: {
    zh: "听听全球零售商和终端用户对我们产品品质的真实反馈",
    en: "What our global retailers and customers are saying about us"
  },
  items: [
    {
      id: 1,
      name: { zh: "Sophia Martinez", en: "Sophia Martinez" },
      role: { zh: "时装精品店主, 马德里", en: "Boutique Owner, Madrid" },
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
      content: {
        zh: "与该品牌合作已有三年，成衣的面料手感以及防风防水系列产品的表现超出了我们的预期，销售增长非常快。",
        en: "Cooperating for three years. The garment fabric quality and the performance of waterproof collections exceeded our expectations."
      }
    },
    {
      id: 2,
      name: { zh: "Marcus Vance", en: "Marcus Vance" },
      role: { zh: "资深时尚采购, 纽约", en: "Fashion Buyer, New York" },
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      content: {
        zh: "物流响应非常及时，起订量和定制流程都极其专业，这是我们合作过的最靠谱的供应链伙伴之一。",
        en: "Logistics are responsive and custom workflow is extremely professional. One of the most reliable supply chain partners we've worked with."
      }
    }
  ]
};

export default testimonialsProps;
