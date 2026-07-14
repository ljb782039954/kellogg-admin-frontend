import type { CtaBannerContent } from '../../components/blocks';

export const ctaBannerProps: CtaBannerContent = {
  title: {
    zh: "准备好开启您的独特商业定制了吗？",
    en: "Ready to Start Your Custom Order?"
  },
  subtitle: {
    zh: "立即提交您的定制询盘信息，专属大客户经理将在 12 小时内为您提供报价与方案！",
    en: "Submit your custom inquiry now, our dedicated key account manager will provide quote in 12 hours!"
  },
  values: {
    alignment: "center",
    backgroundImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80",
    primaryButton: {
      id: "inquiry",
      name: { zh: "立即提交询盘", en: "Submit Inquiry" },
      linkType: "internal",
      href: "/inquiry",
    },
    secondaryButton: {
      id: "products",
      name: { zh: "浏览商品", en: "Browse Products" },
      linkType: "internal",
      href: "/products",
    },
  }
};

export default ctaBannerProps;
